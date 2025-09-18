
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:block">
          <SidebarNav />
        </Sidebar>
        <SidebarRail />
        <SidebarInset className="flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
