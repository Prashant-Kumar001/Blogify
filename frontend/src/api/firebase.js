// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj5cWrKhViPrCvEOAipwIr3jw9i80vjdA",
  authDomain: "user-data-bbb06.firebaseapp.com",
  projectId: "user-data-bbb06",
  storageBucket: "user-data-bbb06.firebasestorage.app",
  messagingSenderId: "547696840670",
  appId: "1:547696840670:web:e82335c613a92ac5b6574f",
  databaseURL: 'https://user-data-bbb06-default-rtdb.firebaseio.com'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
