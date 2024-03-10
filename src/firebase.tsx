import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWiO20r_vJQs7bQM1pHdN11nD3yUcXtGU",
  authDomain: "tfd18-justatimer.firebaseapp.com",
  projectId: "tfd18-justatimer",
  storageBucket: "tfd18-justatimer.appspot.com",
  messagingSenderId: "631976735527",
  appId: "1:631976735527:web:f9abeb75bb6754583daf02"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);