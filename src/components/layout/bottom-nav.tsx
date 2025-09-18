
'use client';

import { Home, Gavel, Book, DollarSign, Headset } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/bids', label: 'My Bids', icon: Gavel },
  { href: '/passbook', label: 'Passbook', icon: Book },
  { href: '/dashboard', label: 'Home', icon: Home, isCentral: true },
  { href: '/wallet', label: 'Funds', icon: DollarSign },
  { href: '/support', label: 'Support', icon: Headset },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-[0_-1px_4px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          if (item.isCentral) {
            return (
              <Link href={item.href} key={item.href}>
                <div className="relative -top-6 flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg">
                  <item.icon className="h-8 w-8" />
                  <span className="sr-only">{item.label}</span>
                </div>
              </Link>
            );
          }
          return (
            <Link href={item.href} key={item.href}>
              <div
                className={cn(
                  'flex flex-col items-center justify-center text-xs gap-1 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
