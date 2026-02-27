
'use client';

import { Button } from '@/components/ui/button';
import { Bell, Wallet2, Menu, LogOut } from 'lucide-react';
import { useAppStore, useAuthStore, useUserProfileStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUserDetails } from '@/app/actions/user';
import { logout as logoutAction } from '@/app/actions/auth';

export function Header() {
  const { toggleSheet } = useAppStore();
  const { token, logout: logoutFromStore } = useAuthStore();
  const isAuthenticated = !!token;
  const { userProfile, setUserProfile, clearUserProfile } = useUserProfileStore();
  const router = useRouter();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchUserDetails() {
      if (isAuthenticated) {
        const result = await getUserDetails();
        if (result.success && result.data) {
          // If the balance changed or profile is completely new, update it.
          // This ensures the header natively reflects DB changes (e.g., from another tab or admin deduction).
          setUserProfile(result.data);
        } else {
          console.error('Failed to fetch user details:', result.error);
        }
      }
    }

    // Initial fetch if we don't have the profile yet but are authenticated
    if (isAuthenticated && !userProfile) {
      fetchUserDetails();
    }

    // Set up polling every 10 seconds to keep balance "Live"
    if (isAuthenticated) {
      intervalId = setInterval(fetchUserDetails, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated, userProfile, setUserProfile]);

  const handleLogout = async () => {
    await logoutAction(); // Clear cookie via server action
    logoutFromStore(); // Clear client-side state
    clearUserProfile(); // Clear user profile from session storage
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Sara</span>
          <span>999</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <>
            <Button variant="ghost" size="icon">
              <Wallet2 className="h-5 w-5" />
              <span className="ml-1 font-bold text-sm">{userProfile?.wallet_balance || '...'}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSheet}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </div>
    </header>
  );
}
