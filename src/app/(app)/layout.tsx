
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';
import { Loader2 } from 'lucide-react';
import { ApiLogger } from '@/components/debug/api-logger';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  
  // This state is necessary to avoid rendering children before the auth check is complete.
  // It also helps prevent a flash of the login page on a page reload for authenticated users.
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  useEffect(() => {
    // Check if the auth state has been determined (it might take a moment for the persisted state to load)
    const hasHydrated = useAuthStore.persist.hasHydrated();

    const checkAuth = () => {
      const state = useAuthStore.getState();
      if (!state.isAuthenticated) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    };

    if (!hasHydrated) {
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            checkAuth();
        });
        return unsubscribe;
    }

    checkAuth();
  }, [isAuthenticated, router]);

  if (isCheckingAuth) {
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
