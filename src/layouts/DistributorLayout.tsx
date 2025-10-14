import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DistributorSidebar } from "@/components/DistributorSidebar";

interface DistributorLayoutProps {
  children: React.ReactNode;
}

export function DistributorLayout({ children }: DistributorLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DistributorSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 bg-background">
            <SidebarTrigger />
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
