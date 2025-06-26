// /ProgressQuestWeb/src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Конфигурация Firebase, считываемая из переменных окружения Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Инициализация Firebase приложения (синглтон)
// Проверка `getApps().length` предотвращает повторную инициализацию при Hot Reloading в Vite
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Получение инстансов сервисов
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || "us-central1");
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Продакшен версия - эмуляторы отключены
console.log('Firebase initialized for production');

// Настройка Google Auth Provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Экспорт готовых к использованию инстансов
export { app, auth, db, functions, storage, googleProvider };