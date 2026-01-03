import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User, LogOut, ClipboardList, UserCircle, Menu, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setSheetOpen(false);
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    setSheetOpen(false);
    navigate(path);
  };

  // Mobile: Sheet menu (hamburger)
  const MobileMenu = () => (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col gap-2 mt-6">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 mb-2 border-b">
                <p className="font-medium">{user?.user_metadata?.full_name || "Cliente"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                className="justify-start h-12"
                onClick={() => handleNavigate("/customer/profile")}
              >
                <User className="mr-3 h-5 w-5" />
                Meu Perfil
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-12"
                onClick={() => handleNavigate("/customer/history")}
              >
                <ClipboardList className="mr-3 h-5 w-5" />
                Meus Pedidos
              </Button>
              <div className="border-t mt-2 pt-2">
                <Button
                  variant="ghost"
                  className="justify-start h-12 w-full text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                className="justify-start h-12"
                onClick={() => handleNavigate("/customer/login")}
              >
                <LogIn className="mr-3 h-5 w-5" />
                Entrar
              </Button>
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => handleNavigate("/customer/signup")}
              >
                <UserPlus className="mr-3 h-5 w-5" />
                Criar Conta
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  // Desktop: Original buttons/dropdown
  const DesktopMenu = () => {
    if (!isAuthenticated) {
      return (
        <div className="hidden md:flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/customer/login")}
          >
            Login
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/customer/signup")}
          >
            Criar Conta
          </Button>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-full">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name || "Cliente"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/customer/profile")}>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/customer/history")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Meus Pedidos
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
};
