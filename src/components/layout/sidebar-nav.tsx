'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Target,
  LineChart,
  ScrollText,
  Wallet,
  BookText,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/predictions', label: 'Predictions', icon: Target },
  { href: '/charts', label: 'Charts', icon: LineChart },
  { href: '/results', label: 'Results', icon: ScrollText },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/rules', label: 'How to Play', icon: BookText },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
