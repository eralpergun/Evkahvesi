
// @ts-ignore
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// @ts-ignore
import { getAnalytics, isSupported } from "firebase/analytics";

// HATA AYIKLAMA NOTU:
// Eğer "Veritabanına ulaşılamadı (Zaman Aşımı)" hatası alıyorsanız:
// 1. Firebase Konsolu'nda "Realtime Database" oluşturduğunuzdan emin olun.
// 2. Oluştururken "Konum" (Location) olarak ne seçtiğinize bakın.
//    - "United States" seçtiyseniz -> SEÇENEK 1'i kullanın.
//    - "Belgium" (Europe) seçtiyseniz -> SEÇENEK 2'yi kullanın.
// 3. Aşağıdaki 'firebaseConfig' nesnesini, Firebase Konsolu > Proje Ayarları kısmındaki
//    kendi proje ayarlarınızla DEĞİŞTİRMENİZ GEREKMEKTEDİR.

const firebaseConfig = {
  apiKey: "AIzaSyDP-nSV9h2rm8L0HpgqbkuwRGEAINS-eds",
  authDomain: "evkahve.firebaseapp.com",
  
  // SEÇENEK 1: Varsayılan (ABD Sunucusu)
  // databaseURL: "https://evkahve-default-rtdb.firebaseio.com",
  
  // SEÇENEK 2: Avrupa Sunucusu (Türkiye için genellikle bu veya us-central1 seçilir)
  // ŞU AN AKTİF OLAN BU:
  databaseURL: "https://evkahve-default-rtdb.europe-west1.firebasedatabase.app",

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
