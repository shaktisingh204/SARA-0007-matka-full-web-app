// src/app/(app)/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';
import { Loader2 } from 'lucide-react';
import { ApiLogger } from '@/components/debug/api-logger';
import Cookies from 'js-cookie';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
    if (!isCheckingAuth && !token) {
      router.push('/login');
    }
  }, [isCheckingAuth, token, router]);

  if (isCheckingAuth || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
