// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webgenai-a3ecb.firebaseapp.com",
  projectId: "webgenai-a3ecb",
  storageBucket: "webgenai-a3ecb.firebasestorage.app",
  messagingSenderId: "674278430786",
  appId: "1:674278430786:web:f4dd4d0452929f9757b5db",
  measurementId: "G-K7LS3MRH3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
