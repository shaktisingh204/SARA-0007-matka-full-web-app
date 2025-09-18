import { AdminSidebarNav } from '@/components/admin/admin-sidebar-nav';
import { Header } from '@/components/layout/header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebarNav />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/40">
            {children}
        </main>
      </div>
    </div>
  );
}
