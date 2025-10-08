
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';
import { ApiLogger } from '@/components/debug/api-logger';

function AppProvider({ children }: { children: React.ReactNode }) {
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

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!token && !isAuthPage) {
      router.push('/login');
    }
  }, [isCheckingAuth, token, router, pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {children}
      </div>
    )
  }

  // This prevents rendering the app layout for a brief moment before redirecting
  if (!token) {
     return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
