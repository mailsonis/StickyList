// src/app/login/layout.tsx
import { UserProvider } from '@/firebase/auth/use-user';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
