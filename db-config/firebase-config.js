// src/db-config/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp, admin } from '../src/firebaseAdmin.js';

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
const db = getFirestore(app);

export { admin, auth, db };