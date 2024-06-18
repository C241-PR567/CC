import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from "dotenv";

dotenv.config();
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket:  process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
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