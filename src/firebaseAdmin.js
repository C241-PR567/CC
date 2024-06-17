// src/firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from '../db-config/serviceAccount.json' assert { type: 'json' };

let firebaseApp;

if (!admin.apps.length) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
  });
} else {
  firebaseApp = admin.app();
}

export { firebaseApp, admin };