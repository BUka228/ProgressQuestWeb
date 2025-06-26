// /ProgressQuestWeb/src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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
const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || "europe-west1");
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// --- Эмуляторы (для локальной разработки) ---
if (import.meta.env.DEV) {
  try {
    console.log("DEV mode detected. Connecting to Firebase emulators...");
    
    // Firebase по умолчанию использует localhost, но для некоторых систем
    // (например, Docker или WSL2) может потребоваться явное указание IP.
    const host = window.location.hostname;
    
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
    connectFunctionsEmulator(functions, host, 5001);
    connectStorageEmulator(storage, host, 9199);
    
    console.log("Successfully connected to Firebase emulators.");
  } catch (error) {
    console.error("Error connecting to Firebase emulators:", error);
  }
}

// Экспорт готовых к использованию инстансов
export { app, auth, db, functions, storage, googleProvider };