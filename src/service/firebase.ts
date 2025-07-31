// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhr9tkIctWt96M4P1-E9_CrmDxf9EBMig",
  authDomain: "hahuytap-zalominiapp.firebaseapp.com",
  projectId: "hahuytap-zalominiapp",
  storageBucket: "hahuytap-zalominiapp.firebasestorage.app",
  messagingSenderId: "1064995430640",
  appId: "1:1064995430640:web:413cc9909b000c8794e235",
  measurementId: "G-XCJ4M1LLWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);