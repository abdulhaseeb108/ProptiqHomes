import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-state-643c4.firebaseapp.com",
  projectId: "mern-state-643c4",
  storageBucket: "mern-state-643c4.appspot.com",
  messagingSenderId: "218573936621",
  appId: "1:218573936621:web:02f8fd409de1de6981f9e4",
  measurementId: "G-FK0JXMFGD2"
};

export const app = initializeApp(firebaseConfig);
