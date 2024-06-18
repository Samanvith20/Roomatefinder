// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ9HaaKvKzqKUaTHT-pwzTeZYg3gQA6Hg",
  authDomain: "roommatch-f613f.firebaseapp.com",
  projectId: "roommatch-f613f",
  storageBucket: "roommatch-f613f.appspot.com",
  messagingSenderId: "735247007693",
  appId: "1:735247007693:web:febc3e105c4de99fdf0e84",
  measurementId: "G-J2X4X3L98D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
const auth = getAuth(app);
export { auth };
const db = getFirestore(app)
export {db}
