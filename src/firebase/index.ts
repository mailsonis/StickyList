import { getApp, getApps, initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "./config";

// Re-exporting the hooks and providers
export { FirebaseProvider, useFirebase } from './provider';
export { useUser, UserProvider } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { FirebaseClientProvider } from './client-provider';

// Centralized hook exports
export { useAuth, useFirestore, useFirebaseApp } from './provider';


let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (!getApps().length) {
    const firebaseConfig = getFirebaseConfig();
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  } else {
    firebaseApp = getApp();
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}
