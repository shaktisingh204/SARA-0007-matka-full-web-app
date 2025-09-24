// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BottomSheetNav } from '@/components/layout/bottom-sheet-nav';

export const metadata: Metadata = {
  title: 'MatkaCalc',
  description: 'Number predictions and results for Matka games.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomSheetNav />
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
