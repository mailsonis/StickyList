import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "./config";

function initializeFirebase() {
  const apps = getApps();
  if (apps.length > 0) {
    return getApp();
  }
  const firebaseConfig = getFirebaseConfig();
  return initializeApp(firebaseConfig);
}

export const firebaseApp = initializeFirebase();
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
