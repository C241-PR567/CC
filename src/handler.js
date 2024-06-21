import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, updateDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { db, auth, admin } from "../db-config/firebase-config.js"; 
import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import dotenv from "dotenv";
import loadModel from './predictions/loadModel.js';
import storeData from './predictions/storeData.js';
import predictClassification from './predictions/inferenceService.js';


dotenv.config();

//menginisialisasi GCP
const gcs = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

//mendefinisikan nama bucket dari .env
const bucketName = process.env.STORAGE_BUCKET;
const imageBucketName = process.env.IMAGE_BUCKET;

let model;

// Load model saat server dimulai
loadModel().then(loadedModel => {
    model = loadedModel;
    console.log('Model loaded successfully');
}).catch(err => {
    console.error('Failed to load model:', err);
});

//Handler signup
export const signUp = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        //membuat pengguna baru
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        //menyimpan data user ke firestore
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, { name, email, phone, uid: user.uid, imgUrl: '', profilePicture: '' });
        res.status(200).json({ success: true, msg: 'Berhasil SignUp, silakan SignIn' });
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            res.status(400).json({ success: false, msg: 'Email sudah terdaftar' });
        }
    }
};

//Handler signin
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
      // Sign in dengan email dan password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ambil data user dari Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          // memperbarui timestamp login terakhir
          await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });

          res.json({ success: true, msg: 'Berhasil Sign In', data: { uid: user.uid, email: user.email, name: userData.name } });
      } else {
          res.status(404).json({ success: false, msg: 'User tidak ditemukan' });
      }
  } catch (error) {
    console.error('Error during sign in:', error);
      res.status(404).json({ success: false, msg: 'Error melakukan Sign In' });
  }
};

// Handler signout
export const signOutUser = async (req, res) => {
    try {
        //melakukan signout
        await signOut(auth);
        res.status(200).json({ msg: 'Sign out Berhasil' });
    } catch (error) {
        res.status(500).json({ msg: 'Gagal Melakukan Sign Out' });
    }
};

// Handler reset password
export const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        //mengirim email untuk reset password
        await sendPasswordResetEmail(auth, email);
        res.status(200).json({ msg: 'Link Reset Password Telah Dikirim Ke Email' });
    } catch (error) {
        res.status(400).json({ msg: 'Error melakukan reset password' });
    }
};

// Handler for uploading profile picture
export const uploadProfilePicture = async (req, res) => {
    try {
        //cek apakah ada file
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      //cek apakah ada uid
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).send('User ID is required.');
      }
  
      const imageFile = req.file;
      //definisi bucket untuk menyimpan image profil
      const bucket = gcs.bucket('profile-id');
      const fileName = `${Date.now()}_${imageFile.originalname}`;
      const fileUpload = bucket.file(fileName);
  
      //membuat stream
      const stream = fileUpload.createWriteStream({
        metadata: { contentType: imageFile.mimetype }
      });
  
      stream.on('error', (error) => {
        console.error('Error uploading file:', error);
        return res.status(500).send('Internal Server Error');
      });
  
      stream.on('finish', async () => {
        try {
            //mendapatkan url dari image
          const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '01-01-2025'
          });
  
          //update document user
          const userDoc = doc(db, 'users', uid);
          await updateDoc(userDoc, { imgUrl: url, profilePicture: url });
          res.status(200).json({ status: 'Success', message: 'Profile picture berhasil ditambahkan', fileName, url });
        } catch (error) {
          console.error('Error updating document:', error);
          res.status(500).send('Internal Server Error');
        }
      });
  
      stream.end(imageFile.buffer);
    } catch (error) {
      console.error('Error handling upload:', error);
      res.status(500).send('Internal Server Error');
    }
  };

//Predict Disease Handler
export const predictDisease = async (req, res) => {
    try {
        // Cek apakah ada file yang diupload
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const imageFile = req.file;
        const uid = req.uid; // Dapatkan UID dari middleware
        // Periksa apakah UID ada
        if (!uid) {
            return res.status(400).send('User ID is required.');
        }

        const fileName = `${uid}_${Date.now()}_${imageFile.originalname}`;
        const bucket = gcs.bucket(imageBucketName);
        const fileUpload = bucket.file(fileName);

        // Buat stream upload
        const stream = fileUpload.createWriteStream({
            metadata: { contentType: imageFile.mimetype }
        });

        stream.on('error', (error) => {
            console.error('Error uploading file:', error);
            res.status(500).send('Internal Server Error');
        });

        stream.on('finish', async () => {
            try {
                // Dapatkan URL gambar dari GCS
                const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '01-01-2025' });

                // Unduh gambar dari URL
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data, 'binary');

                // Lakukan prediksi
                const prediction = await predictClassification(model, imageBuffer);
                const predictionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                // Simpan hasil prediksi ke Firestore
                await storeData(predictionId, { ...prediction, imageUrl: url, userId: uid });

                // Kembalikan respons dengan detail prediksi
                res.status(200).json({
                  url,
                  prediction: {
                    confidenceScore: prediction.confidenceScore,
                    label: prediction.label,
                    description: prediction.description 
                  }
                });
            } catch (error) {
                console.error('Error during prediction:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        stream.end(imageFile.buffer);
    } catch (error) {
        console.error('Error during prediction:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Fungsi untuk mendapatkan daftar penyakit dari Firestore
export const getDiseaseList = async (req, res) => {
    try {
        const diseasesCollection = collection(db, 'db-diseases');
        const diseasesSnapshot = await getDocs(diseasesCollection);
        const diseaseList = diseasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json({ diseases: diseaseList });
    } catch (error) {
        console.error('Error fetching disease list:', error);
        res.status(500).json({ msg: 'Error fetching disease list' });
    }
};

//untuk mendapatkan detail dari penyakit
export const getDiseaseById = async (req, res) => {
    const { id } = req.params;
  
    try {
      console.log(`Fetching disease with id: ${id}`);
      const diseaseDoc = doc(db, 'db-diseases', id);
      const docSnap = await getDoc(diseaseDoc);
  
      if (docSnap.exists()) {
        const diseaseData = docSnap.data();
        console.log(`Disease data found: ${JSON.stringify(diseaseData)}`);
  
        res.status(200).json({
          success: true,
          msg: 'Berhasil',
          data: diseaseData,
        });
      } else {
        console.log(`No disease found with id: ${id}`);
        res.status(404).json({
          success: false,
          msg: 'Penyakit tidak ditemukan',
        });
      }
    } catch (error) {
      console.log('Error getting disease:', error);
      res.status(500).json({
        success: false,
        msg: 'Terjadi kesalahan, tunggu beberapa saat',
      });
    }
  };