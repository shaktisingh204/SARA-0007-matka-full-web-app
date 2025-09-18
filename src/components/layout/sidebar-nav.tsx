
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
  Gavel,
  Book,
  IndianRupee,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/bids', label: 'My Bids', icon: Gavel },
  { href: '/passbook', label: 'Passbook', icon: Book },
  { href: '/predictions', label: 'Predictions', icon: Target },
  { href: '/charts', label: 'Charts', icon: LineChart },
  { href: '/results', label: 'Results', icon: ScrollText },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/rules', label: 'How to Play', icon: BookText },
  { href: '/rates', label: 'Game Rates', icon: IndianRupee },
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
                isActive={pathname.startsWith(item.href)}
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
