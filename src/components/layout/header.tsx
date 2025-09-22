
'use client';

import { Button } from '@/components/ui/button';
import { Bell, Wallet2, Menu, LogOut } from 'lucide-react';
import { useAppStore, useAuthStore, useUserProfileStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getUserDetails } from '@/app/actions/user';

export function Header() {
  const { toggleSheet } = useAppStore();
  const { isAuthenticated, logout } = useAuthStore();
  const { userProfile, setUserProfile, clearUserProfile } = useUserProfileStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserDetails() {
      if (isAuthenticated && !userProfile) {
        const result = await getUserDetails();
        if (result.success && result.data) {
          setUserProfile(result.data);
        } else {
          console.error('Failed to fetch user details:', result.error);
        }
      }
    }
    fetchUserDetails();
  }, [isAuthenticated, userProfile, setUserProfile]);

  const handleLogout = () => {
    logout();
    clearUserProfile();
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
