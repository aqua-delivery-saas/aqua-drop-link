import { AdminSidebar } from '@/components/AdminSidebar';
import { BottomNav } from '@/components/BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Building2, DollarSign, Tags } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Usuários', path: '/admin/users', icon: Users },
  { title: 'Distribuidoras', path: '/admin/distributors', icon: Building2 },
  { title: 'Marcas', path: '/admin/brands', icon: Tags },
  { title: 'Finanças', path: '/admin/financial-reports', icon: DollarSign },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <main className={cn("flex-1 p-4 sm:p-8", isMobile && "pb-mobile-nav")}>
        {children}
      </main>
      <BottomNav items={adminNavItems} />
    </div>
  );
}
