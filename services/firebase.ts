
// @ts-ignore
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// @ts-ignore
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDP-nSV9h2rm8L0HpgqbkuwRGEAINS-eds",
  authDomain: "evkahve.firebaseapp.com",
  // ÖNEMLİ: Realtime Database URL'i eklenmeli.
  // Varsayılan (US-Central1): https://evkahve-default-rtdb.firebaseio.com
  // Eğer Avrupa (Belçika) seçtiyseniz: https://evkahve-default-rtdb.europe-west1.firebasedatabase.app
  // Lütfen Firebase konsolundan Realtime Database başlığındaki URL ile burayı kontrol edin.
  databaseURL: "https://evkahve-default-rtdb.firebaseio.com",
  projectId: "evkahve",
  storageBucket: "evkahve.firebasestorage.app",
  messagingSenderId: "1054934114759",
  appId: "1:1054934114759:web:5164eda67b7009f6f6b9e2",
  measurementId: "G-M2T17DVS2H"
};

// Firebase Uygulamasını Başlat
const app = initializeApp(firebaseConfig);

// Servisleri Dışa Aktar
export const db = getDatabase(app);
export const auth = getAuth(app);

// Analytics'i desteklenen ortamlarda başlat
isSupported().then(supported => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(err => console.error("Analytics init error:", err));
