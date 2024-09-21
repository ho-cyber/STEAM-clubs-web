// Example Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAP3XdxNvfyCRGBT18vcQIQNzZxLNkuCj4",
  authDomain: "dhruv-bynj.firebaseapp.com",
  projectId: "dhruv-bnyj",
  storageBucket: "dhruv-bnyj.appspot.com",
  messagingSenderId: "799416262049",
  appId: "1:799416262049:web:fc95bdf6edee237b3a7fe0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
