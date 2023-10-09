import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE1P4fAiwOzi8PIP3r1lsxuBYpGbbTzTA",
  authDomain: "recipe-tracker-53956.firebaseapp.com",
  projectId: "recipe-tracker-53956",
  storageBucket: "recipe-tracker-53956.appspot.com",
  messagingSenderId: "201142444108",
  appId: "1:201142444108:web:3c452f3bdca952d7aa54e9"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebaseApp.firestore();
export const storage = firebase.storage();