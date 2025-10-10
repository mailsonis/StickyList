import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from "@/firebase/provider";
import { UserProvider } from "@/firebase/auth/use-user";
import './globals.css';

const APP_NAME = "StickyList";
const APP_DEFAULT_TITLE = "StickyList";
const APP_TITLE_TEMPLATE = "%s - StickyList";
const APP_DESCRIPTION = "Sua lista de compras inteligente e divertida!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FFF8C6" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
