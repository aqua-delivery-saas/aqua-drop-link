import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DistributorSidebar } from "@/components/DistributorSidebar";
import { useNavigate } from "react-router-dom";
import { UserCircle, User, LogOut } from "lucide-react";
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

const mockUser = {
  name: "João Silva",
  email: "joao@aguapura.com.br",
};

interface DistributorLayoutProps {
  children: React.ReactNode;
}

export function DistributorLayout({ children }: DistributorLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/distributor/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DistributorSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-4 bg-background relative z-10">
            <SidebarTrigger />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <span className="hidden md:inline-block">{mockUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{mockUser.name}</p>
                    <p className="text-xs text-muted-foreground">{mockUser.email}</p>
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
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
