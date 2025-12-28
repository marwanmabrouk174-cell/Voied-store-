// 1️⃣ استيراد المكتبات من CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 2. إعدادات المشروع (Config)
const firebaseConfig = {
  apiKey: "AIzaSyBXhptrvgAMZzCUncNPcc8A5eBxR1mN3JI",
  authDomain: "voiedstore.firebaseapp.com",
  projectId: "voiedstore",
  storageBucket: "voiedstore.appspot.com",
  messagingSenderId: "42412049812",
  appId: "1:42412049812:web:b1ebae8e08aafc9d40fb81",
  measurementId: "G-DEX0S0MH2P"
};


// 3️⃣ تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 4️⃣ تصدير الأدوات لبقية الملفات
export const auth = getAuth(app);       // Auth للأدمن
export const db = getFirestore(app);     // Firestore للمنتجات
export const storage = getStorage(app);  // Storage للصور
