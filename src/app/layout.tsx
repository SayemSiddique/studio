import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Safora: AI Food Insights',
  description: 'AI-Powered Dietary Analysis and Food Compatibility',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ProfileProvider>
            {children}
            <Toaster />          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>  );
}
