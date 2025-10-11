// src/firebase/provider.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const app = getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

function useFirebaseContext() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      throw new Error("useFirebaseContext must be used within a FirebaseProvider");
    }
    return context;
}

export function useFirebase() {
    return useFirebaseContext();
}

export function useFirebaseApp() {
    return useFirebaseContext().app;
}
  
export function useAuth() {
    return useFirebaseContext().auth;
}

export function useFirestore() {
    return useFirebaseContext().firestore;
}
