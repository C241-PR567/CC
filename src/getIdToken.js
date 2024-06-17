import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyApj_lBE3j7hw-iEb_iA41nzXyFKxibelQ",
  authDomain: "capstone-project-c241-pr567.firebaseapp.com",
  databaseURL: "https://capstone-project-c241-pr567.asia-southeast1.firebasedatabase.app/",
  projectId: "capstone-project-c241-pr567",
  storageBucket: "skin-predict",
  messagingSenderId: "928838313614",
  appId: "1:928838313614:web:9ff46d7181b569b52b4bdf",
  measurementId: "G-4837171KW4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getIdToken(email, password) {
  try {
    // Melakukan sign-in dengan email dan password yang diberikan
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Mendapatkan user dari hasil sign-in
    const user = userCredential.user;
    // Mendapatkan ID Token dari user yang telah sign-in
    const token = await user.getIdToken();
    // Mencetak ID Token ke konsol
    console.log('ID Token:', token);
    // Mengembalikan ID Token
    return token;
  } catch (error) {
    // Mencetak pesan kesalahan ke konsol jika terjadi kesalahan
    console.error('Error getting ID token:', error);
  }
}

// Mendapatkan email dari argumen baris perintah atau variabel lingkungan
const email = process.argv[2] || process.env.FIREBASE_EMAIL;
// Mendapatkan password dari argumen baris perintah atau variabel lingkungan
const password = process.argv[3] || process.env.FIREBASE_PASSWORD;

// Memeriksa apakah email dan password telah diberikan
if (!email || !password) {
  // Mencetak pesan kesalahan ke konsol jika email atau password tidak diberikan
  console.error('Please provide email and password as command line arguments or set FIREBASE_EMAIL and FIREBASE_PASSWORD environment variables');
  // Mengakhiri proses dengan kode keluar 1 (kesalahan)
  process.exit(1);
}

// Memanggil fungsi getIdToken dengan email dan password, lalu mengakhiri proses setelah selesai
getIdToken(email, password).then(() => process.exit(0));