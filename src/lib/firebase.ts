import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Helper to get env var with VITE_ or REACT_APP_ prefix
const getEnv = (key: string) => {
  // @ts-ignore
  return import.meta.env[`VITE_${key}`] || import.meta.env[`REACT_APP_${key}`]
}

const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID"),
  measurementId: getEnv("FIREBASE_MEASUREMENT_ID"),
};

// Debug config (masking sensitive values)
console.log("Firebase Config Loaded:", {
  apiKey: firebaseConfig.apiKey ? "Set" : "Missing",
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
})

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
