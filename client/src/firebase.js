import firebase from "firebase/app";
import "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwOYLA824WgNDNgXwVOx-WUxxaLim_6cM",
  authDomain: "ecommerce-2a9cd.firebaseapp.com",
  projectId: "ecommerce-2a9cd",
  storageBucket: "ecommerce-2a9cd.appspot.com",
  messagingSenderId: "925833595548",
  appId: "1:925833595548:web:9800337e885b867126bb59",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
