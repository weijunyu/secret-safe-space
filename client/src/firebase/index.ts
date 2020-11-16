// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAFvEUThHw8DvbOHCFXO5AiAGDrRn9HSHQ",
  authDomain: "shh-xyz.firebaseapp.com",
  databaseURL: "https://shh-xyz.firebaseio.com",
  projectId: "shh-xyz",
  storageBucket: "shh-xyz.appspot.com",
  messagingSenderId: "227655520477",
  appId: "1:227655520477:web:5739a7f2027e86c15fcb34",
  measurementId: "G-GFV44QGE0R",
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseFunctions = firebaseApp.functions("asia-southeast2");
