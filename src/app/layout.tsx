// src/app/layout.tsx
'use client';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/lib/store';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';
import { ApiLogger } from '@/components/debug/api-logger';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

// export const metadata: Metadata = {
//   title: 'MatkaCalc',
//   description: 'AI-Powered Matka Game Assistant',
// };

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setToken, token } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const tokenFromCookie = Cookies.get('auth_token');
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
    }
    setIsCheckingAuth(false);
  }, [setToken]);

  useEffect(() => {
    if (isCheckingAuth) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

    if (!token && !isAuthPage) {
      router.push('/login');
    }
    if (token && isAuthPage) {
      router.push('/dashboard');
    }
  }, [isCheckingAuth, token, router, pathname]);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isCheckingAuth || (!token && !isAuthPage)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomSheetNav />
      <BottomNav />
      <ApiLogger />
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
