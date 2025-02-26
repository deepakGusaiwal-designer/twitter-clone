// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0aS27PZe9w2qJygZmo_dI6qa4zXiX1qk",
    authDomain: "twitter-clone-db05f.firebaseapp.com",
    projectId: "twitter-clone-db05f",
    storageBucket: "twitter-clone-db05f.firebasestorage.app",
    messagingSenderId: "431376433406",
    appId: "1:431376433406:web:deba5e2ea95c1c9d9f25af",
    measurementId: "G-67KB2PLKD1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);