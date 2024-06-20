import express from 'express';
import { signUp, signIn, signOutUser, resetPassword, uploadProfilePicture, predictDisease, getDiseaseList, getDiseaseById } from './handler.js';
import multer from 'multer';
import { verifyAuth } from './authMiddleware.js';
import { getIdToken } from 'firebase/auth';

const router = express.Router();

// Middleware untuk mengunggah file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Rute untuk signup
router.post('/signup', signUp);

// Rute untuk signin
router.post('/signin', signIn);

// Rute untuk signout
router.post('/signout', signOutUser);

// Rute untuk reset password
router.post('/reset-password', resetPassword);

// Rute untuk mengunggah gambar profil
router.post('/upload-profile-picture', verifyAuth, upload.single('image'), uploadProfilePicture);

// Rute untuk prediksi penyakit
router.post('/predict', verifyAuth, upload.single('image'), predictDisease);

// Rute untuk list penyakit
router.get('/list-diseases', getDiseaseList);

//Rute untuk menampilkan detail dari penyakit
router.get('/list-diseases/:id', getDiseaseById);

export default router;
