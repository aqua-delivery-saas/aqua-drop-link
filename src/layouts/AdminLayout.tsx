import { AdminSidebar } from '@/components/AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <main className={cn("flex-1 p-4 sm:p-8", isMobile && "pb-mobile-nav")}>
        {children}
      </main>
    </div>
  );
}
