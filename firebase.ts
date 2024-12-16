// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIl44bhQZkls5GtLP8miSKRqrTP9LoBu4",
  authDomain: "trustless-work.firebaseapp.com",
  projectId: "trustless-work",
  storageBucket: "trustless-work.firebasestorage.app",
  messagingSenderId: "673169668503",
  appId: "1:673169668503:web:5c8c202fc78a17a7c62cd2",
  measurementId: "G-H8SM5Z3EVC",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

export const firebaseDB = getFirestore(firebaseApp);