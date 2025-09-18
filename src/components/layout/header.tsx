
'use client';

import { Button } from '@/components/ui/button';
import { Bell, Wallet2, Menu } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Header() {
  const { toggleSheet } = useStore();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Sara</span>
          <span>999</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Wallet2 className="h-5 w-5" />
          <span className="ml-1 font-bold text-sm">4264</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSheet}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </div>
    </header>
  );
}
