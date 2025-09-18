
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';

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
        <div className="flex flex-1 flex-col">
          <div className="flex-1 flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>
          </div>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
