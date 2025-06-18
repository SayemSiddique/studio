import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google'; // Changed from Inter to Poppins

// Configure Poppins font
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'] 
});

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
        {/* Google Fonts link for PT Sans is removed as Poppins is now loaded via next/font */}
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}> {/* Changed to poppins.className */}
        <AuthProvider>
          <ProfileProvider>
            {children}
            <Toaster />
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
