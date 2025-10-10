// This file is used to initialize the Firebase Admin SDK.
// It is used by the server-side code to interact with Firebase services.

// To get the service account key, go to the Firebase console,
// open "Project settings", and then the "Service accounts" tab.
// Click "Generate new private key", and then copy the JSON content
// into a new file named "service-account.json" in the root of your project.

// Make sure to add "service-account.json" to your ".gitignore" file
// to prevent it from being committed to your repository.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseConfig() {
  if (!firebaseConfig.apiKey) {
    throw new Error('Missing Firebase config: Make sure to set the environment variables in your .env file');
  }
  return firebaseConfig;
}
