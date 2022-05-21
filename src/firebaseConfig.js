import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCD2l-_khwYqfcOQskaXpgiirVd6C7Pidg",
  authDomain: "delta-process-test.firebaseapp.com",
  projectId: "delta-process-test",
  storageBucket: "delta-process-test.appspot.com",
  messagingSenderId: "772620139255",
  appId: "1:772620139255:web:b14dc698a928cef11731f2",
});

// Firebase storage reference
const storage = getStorage(app);
export default storage;
