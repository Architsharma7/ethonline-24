// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAJcqiCW41EPyGj3FO_LVFiEsJC5Oczows",
  authDomain: "defi-treasure.firebaseapp.com",
  projectId: "defi-treasure",
  storageBucket: "defi-treasure.appspot.com",
  messagingSenderId: "502494000722",
  appId: "1:502494000722:web:4a654c2141c27b7fa7d18b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);