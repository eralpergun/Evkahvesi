
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0BL_jivW7DP1jZfNT_gFnRM3IgPgnWx8",
  authDomain: "evcoffeetr.firebaseapp.com",
  projectId: "evcoffeetr",
  storageBucket: "evcoffeetr.firebasestorage.app",
  messagingSenderId: "421092198821",
  appId: "1:421092198821:web:17d840eaadb1a9c69a004c",
  measurementId: "G-GR9RWVJV1D"
};

// Firebase Uygulamasını Başlat
const app = initializeApp(firebaseConfig);

// Firestore Veritabanı Servisini Dışa Aktar
export const db = getFirestore(app);

// Analytics'i yalnızca desteklenen tarayıcı ortamlarında başlat
isSupported().then(supported => {
  if (supported) {
    getAnalytics(app);
  }
});
