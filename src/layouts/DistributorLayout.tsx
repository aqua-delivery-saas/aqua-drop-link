import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DistributorSidebar } from "@/components/DistributorSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { BottomNav } from "@/components/BottomNav";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { useNavigate } from "react-router-dom";
import { UserCircle, User, LogOut, Home, ShoppingCart, Package, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDistributor } from "@/hooks/useDistributor";
import { Skeleton } from "@/components/ui/skeleton";

const bottomNavItems = [
  { title: "Início", path: "/distributor/dashboard", icon: Home },
  { title: "Pedidos", path: "/distributor/orders", icon: ShoppingCart },
  { title: "Produtos", path: "/distributor/products", icon: Package },
  { title: "Config", path: "/distributor/settings", icon: Settings },
];

interface DistributorLayoutProps {
  children: React.ReactNode;
}

export function DistributorLayout({ children }: DistributorLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: distributor, isLoading } = useDistributor();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout realizado com sucesso!", {
      description: "Até logo!",
    });
    navigate("/distributor/login");
  };

  const displayName = distributor?.name || user?.user_metadata?.full_name || user?.email || "Distribuidora";
  const email = user?.email || "";

  return (
    <SidebarProvider>
      <SubscriptionGuard>
        <div className="min-h-screen flex w-full">
          <DistributorSidebar />
          <main className="flex-1 flex flex-col">
            <header className="h-14 border-b flex items-center justify-between px-4 bg-background sticky top-0 z-10">
              <SidebarTrigger />
              
              <div className="flex items-center gap-2">
                <NotificationBell />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      {isLoading ? (
                        <Skeleton className="h-4 w-24 hidden md:block" />
                      ) : (
                        <span className="hidden md:inline-block">{displayName}</span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 animate-fade-in">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/distributor/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Perfil do Usuário
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <div className="flex-1 overflow-auto pb-mobile-nav p-4 sm:p-6">
              {children}
            </div>
          </main>
          <BottomNav items={bottomNavItems} />
        </div>
      </SubscriptionGuard>
    </SidebarProvider>
  );
}
