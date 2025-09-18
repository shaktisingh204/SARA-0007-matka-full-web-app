
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import {
  Target,
  LineChart,
  ScrollText,
  BookText,
  IndianRupee,
  ShieldCheck,
  FileText,
  HeartHandshake,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/predictions', label: 'Predictions', icon: Target },
  { href: '/charts', label: 'Charts', icon: LineChart },
  { href: '/results', label: 'Results', icon: ScrollText },
  { href: '/rules', label: 'How to Play', icon: BookText },
  { href: '/rates', label: 'Game Rates', icon: IndianRupee },
  { href: '/privacy-policy', label: 'Privacy Policy', icon: ShieldCheck },
  { href: '/terms-and-conditions', label: 'Terms & Conditions', icon: FileText },
  { href: '/responsible-gambling', label: 'Responsible Gambling', icon: HeartHandshake },
];

export function BottomSheetNav() {
  const { isSheetOpen, setSheetOpen } = useStore();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent side="bottom" className="rounded-t-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-center">Menu</SheetTitle>
        </SheetHeader>
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
