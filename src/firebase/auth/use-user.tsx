// src/firebase/auth/use-user.tsx
"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { 
    getAuth, 
    onAuthStateChanged, 
    User, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";
import { useAuth } from "@/firebase";

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// This hook is designed to be used with the FirebaseProvider, which should wrap your app.
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);
  
  return (
    <UserContext.Provider value={{ user, loading }}>
        {children}
    </UserContext.Provider>
  )
};


export const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google: ", error);
        throw error;
    }
};

export const signUpWithEmail = async (name: string, email: string, password: string) => {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Manually re-set user to trigger re-render with displayName
        // This is a workaround as onAuthStateChanged might not fire immediately with the new profile
        const updatedUser = { ...userCredential.user, displayName: name };
        return updatedUser;
    } catch (error) {
        console.error("Error signing up with email: ", error);
        throw error;
    }
};

export const signInWithEmail = async (email: string, password: string) => {
    const auth = getAuth();
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing in with email: ", error);
        throw error;
    }
};

export const sendPasswordReset = async (email: string) => {
    const auth = getAuth();
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending password reset email: ", error);
        throw error;
    }
};


export const signOut = async () => {
    const auth = getAuth();
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
        throw error;
    }
}
