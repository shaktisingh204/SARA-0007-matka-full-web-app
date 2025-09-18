
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Button } from '@/components/ui/button';
import { Wallet2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="md:flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarHeader>
              <h1 className="text-2xl font-bold flex items-center gap-2 group-data-[collapsible=icon]:-ml-2">
                <span className="text-primary">Sara</span>
                <span className="group-data-[collapsible=icon]:hidden">999</span>
              </h1>
            </SidebarHeader>
            <SidebarNav />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-4">
             <div className="p-4">{children}</div>
          </main>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
