import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // أضفته لك تحسباً إذا احتجته مستقبلاً

// الإعدادات الجديدة التي حصلت عليها من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBFsWh9No3ldMlv-QdgNaBbjuA0JEwgal0",
  authDomain: "tarteel-c34bd.firebaseapp.com",
  projectId: "tarteel-c34bd",
  storageBucket: "tarteel-c34bd.firebasestorage.app",
  messagingSenderId: "604108924233",
  appId: "1:604108924233:web:bffcb5080c36a677096698",
  measurementId: "G-Z8B10Z78HL"
};

// تهيئة التطبيق مع منع التكرار (مهم جداً لبيئة التطوير)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تصدير الخدمات لاستخدامها في ملف use-auth.tsx وباقي المشروع
export const auth = getAuth(app);
export const db_realtime = getDatabase(app);
export const db = getFirestore(app);

export default app;