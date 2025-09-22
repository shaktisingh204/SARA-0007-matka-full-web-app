// src/app/layout.tsx
'use client';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';
import { BottomNav } from '@/components/layout/bottom-nav';
import { ApiLogger } from '@/components/debug/api-logger';

// Since we are using 'use client', we can't export metadata directly.
// We'll manage the title in the component.
// export const metadata: Metadata = {
//   title: 'MatkaCalc',
//   description: 'Number predictions and results for Matka games.',
// };

const AUTH_ROUTES = ['/login', '/signup'];

function RootApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setToken } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setToken(token); // Hydrate the store
    }

    // Give a moment for the store to update before checking auth
    setTimeout(() => {
        const currentAuthState = useAuthStore.getState().isAuthenticated;

        if (!currentAuthState && !AUTH_ROUTES.includes(pathname)) {
            router.push('/login');
        } else if (currentAuthState && AUTH_ROUTES.includes(pathname)) {
            router.push('/dashboard');
        } else {
            setIsCheckingAuth(false);
        }
    }, 100);

  }, [pathname, router, setToken]);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthRoute) {
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
    <html lang="en">
      <head>
        <title>MatkaCalc</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <RootApp>{children}</RootApp>
        <Toaster />
      </body>
    </html>
  );
}
