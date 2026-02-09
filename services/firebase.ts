
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0BL_jivW7DP1jZfNT_gFnRM3IgPgnWx8",
  authDomain: "evcoffeetr.firebaseapp.com",
  projectId: "evcoffeetr",
  storageBucket: "evcoffeetr.firebasestorage.app",
  messagingSenderId: "421092198821",
  appId: "1:421092198821:web:b7edececde70eb049a004c",
  measurementId: "G-G2K5XWE0EJ"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics opsiyonel (Browser ortamında çalışır)
if (typeof window !== "undefined") {
  getAnalytics(app);
}
