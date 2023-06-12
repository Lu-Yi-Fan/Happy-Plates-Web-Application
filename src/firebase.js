// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/firestore'
import { getFirestore, doc, addDoc } from 'firebase/firestore'
// require("firebase/firestore")


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1ez0vnaZhVi0K4-lO0dt61x9QE6sv3uU",
  authDomain: "happyplates-b82ce.firebaseapp.com",
  projectId: "happyplates-b82ce",
  storageBucket: "happyplates-b82ce.appspot.com",
  messagingSenderId: "691918796507",
  appId: "1:691918796507:web:7aa48b79e562909a603efe"
};


// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
const auth = getAuth(fireBaseApp);
const db = getFirestore(fireBaseApp);

export default { db, fireBaseApp, auth };