// src/components/FirebaseErrorListener.tsx
'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

// This is a simplified dev-only component to show permission errors.
// In a real app, you might want to log this to a service or show a more subtle UI.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Caught Firestore Permission Error:', error);

      // In a dev environment, we can throw to show the Next.js error overlay
      if (process.env.NODE_ENV === 'development') {
        // We wrap this in a timeout to escape the current call stack,
        // allowing the promise to resolve and preventing an "unhandled promise rejection"
        // warning in some cases. The Next.js overlay will still catch it.
        setTimeout(() => {
          throw error;
        });
      } else {
        // In production, just show a generic toast
        toast({
          variant: 'destructive',
          title: 'A permissão foi negada',
          description: 'Você não tem permissão para realizar esta ação.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}
