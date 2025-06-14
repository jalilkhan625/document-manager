import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyBleq9HzSz1ojqJaYnqp6eIatb27uDT35k",
  authDomain: "document-manager-db.firebaseapp.com",
  databaseURL: "https://document-manager-db-default-rtdb.firebaseio.com",
  projectId: "document-manager-db",
  storageBucket: "document-manager-db.appspot.com",
  messagingSenderId: "314755013257",
  appId: "1:314755013257:web:414cb6e050c58996ac4458"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Sign in anonymously
const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous sign-in failed", error);
});
