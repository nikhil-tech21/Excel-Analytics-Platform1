// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// ✅ Remove extra 'const firebaseConfig = {' line
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",  // Replace with your actual Firebase API key
  authDomain: "excelanalytics.firebaseapp.com",
  projectId: "excelanalytics",
  storageBucket: "excelanalytics.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Set up authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export for use in Login component
export { auth, provider, signInWithPopup };