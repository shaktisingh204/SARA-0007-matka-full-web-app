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
  const { setToken, isAuthenticated } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setToken(token);
    }
    setIsCheckingAuth(false);
  }, [setToken]);
  
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push('/login');
    }
  }, [isCheckingAuth, isAuthenticated, router]);

  if (isCheckingAuth || !isAuthenticated) {
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
