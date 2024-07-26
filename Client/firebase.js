import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAQYz0wA9WDdF6nT0LkDtLyX4036zGIPQ",
  authDomain: "apisurv-76b78.firebaseapp.com",
  projectId: "apisurv-76b78",
  storageBucket: "apisurv-76b78.appspot.com",
  messagingSenderId: "75280605938",
  appId: "1:75280605938:web:c018f65a639a1406a5266b",
  measurementId: "G-HXLGT28GME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };
