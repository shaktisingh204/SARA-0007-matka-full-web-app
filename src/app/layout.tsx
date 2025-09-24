// src/app/layout.tsx
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';
import { ApiLogger } from '@/components/debug/api-logger';
import { useAuthStore } from '@/lib/store';

// We need to manually declare metadata here because we are in a client component.
export const metadata: Metadata = {
  title: 'MatkaCalc',
  description: 'Number predictions and results for Matka games.',
};


function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isAuthenticated, setToken, logout } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setToken(token);
    } else {
      logout(); // Ensures client state is cleared if cookie is gone
    }
    setIsCheckingAuth(false);
  }, [setToken, logout]);

  useEffect(() => {
    if (isCheckingAuth) {
      return; // Don't redirect while we're still figuring out if the user is logged in
    }

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    
    if (!isAuthenticated && !isAuthPage) {
      router.push('/login');
    }
    
    if (isAuthenticated && isAuthPage) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isCheckingAuth, pathname, router]);


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

  // If we are authenticated and not on an auth page, render the full app layout.
  if (isAuthenticated) {
     return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomSheetNav />
          <BottomNav />
          <ApiLogger />
        </div>
      );
  }
  
  // This is a fallback for the brief moment before redirection happens.
  return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        <AppProvider>
            {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}