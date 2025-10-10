"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUser, signInWithGoogle } from '@/firebase/auth/use-user';

// Simple SVG for Google icon
const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2c-27.4-26.2-64.3-42.3-106.7-42.3-84.5 0-153.3 68.8-153.3 153.3s68.8 153.3 153.3 153.3c92.1 0 135.5-63.5 141.2-95.2H248v-97.2h239.2c2.4 12.8 3.8 26.4 3.8 40.8z"></path>
    </svg>
);


export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Bem-vindo(a) ao StickyList</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Faça login para começar a criar suas listas de compras.
        </p>
        <Button size="lg" onClick={signInWithGoogle} className="w-full max-w-xs mx-auto">
          <GoogleIcon />
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}
