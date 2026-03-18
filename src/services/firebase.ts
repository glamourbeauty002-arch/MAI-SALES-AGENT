import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBSsJUWhGUFMJGTVBDZvjbv01N7iLaSunU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mai-sales-agent.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mai-sales-agent",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mai-sales-agent.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "680547729953",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:680547729953:web:be959e598475a7d6e3d960",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FW20Y7ECB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics is only supported in certain environments
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
