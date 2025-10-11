// src/firebase/client-provider.tsx
"use client";
import { ReactNode } from "react";
import { FirebaseProvider } from "./provider";
import { initializeFirebase } from ".";

// This component ensures that Firebase is initialized on the client-side
// and that the Firebase context is provided to its children.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // We are calling initializeFirebase here to ensure it's only done once on the client
  // but we are not passing the result down directly. The FirebaseProvider will
  // handle getting the instances.
  initializeFirebase();

  return <FirebaseProvider>{children}</FirebaseProvider>;
}
