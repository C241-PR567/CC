// src/authMiddleware.js
import { admin } from './firebaseAdmin.js';

export const verifyAuth = async (req, res, next) => {
    // Mendapatkan token dari header Authorization (format: 'Bearer token')
    const token = req.headers.authorization?.split(' ')[1];
    
    // Jika tidak ada token, mengembalikan respon dengan status 403 (Forbidden) dan pesan 'Unauthorized access'
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    try {
       // Memverifikasi token menggunakan Firebase Admin SDK
       const decodedToken = await admin.auth().verifyIdToken(token);
       // Jika token valid, mencetak informasi token yang sudah didekodekan ke konsol
       console.log('Token is valid:', decodedToken);
       // Menyimpan uid (user ID) dari token yang sudah didekodekan ke dalam objek request
       req.uid = decodedToken.uid;
       // Melanjutkan ke middleware atau route handler berikutnya
       next();
   } catch (error) {
       // Jika verifikasi token gagal, mencetak pesan kesalahan ke konsol
       console.error('Token verification failed:', error);
       // Mengembalikan respon dengan status 403 (Forbidden) dan pesan 'Unauthorized access'
       res.status(403).json({ message: 'Unauthorized access' });
    }
};