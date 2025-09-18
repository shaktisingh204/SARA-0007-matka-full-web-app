'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, LayoutDashboard, Users, Gavel, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/bids', label: 'Bids', icon: Gavel },
    { href: '/admin/results', label: 'Results', icon: ScrollText },
]

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                    <Crown className="h-6 w-6 text-primary" />
                    <span className="">Matka Admin</span>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map(item => (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === item.href && "bg-muted text-primary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    </div>
  );
}
