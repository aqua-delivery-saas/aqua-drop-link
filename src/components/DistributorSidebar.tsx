import { LayoutDashboard, Package, Settings, ShoppingCart, ChevronDown, Search, Clock, Percent, Gift, CreditCard, BarChart3 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "./Logo";

  const menuItems = [
    { title: "Dashboard", url: "/distributor/dashboard", icon: LayoutDashboard },
    { title: "Pedidos", url: "/distributor/orders", icon: ShoppingCart },
    { title: "Produtos", url: "/distributor/products", icon: Package },
    { title: "Relatórios", url: "/distributor/reports", icon: BarChart3 },
  ];

const configItems = [
  { title: "Informações", url: "/distributor/settings", icon: Settings },
  { title: "SEO e Descrição", url: "/distributor/settings/seo", icon: Search },
  { title: "Horários", url: "/distributor/settings/business-hours", icon: Clock },
  { title: "Descontos", url: "/distributor/settings/discounts", icon: Percent },
  { title: "Fidelização", url: "/distributor/settings/loyalty", icon: Gift },
  { title: "Assinatura", url: "/distributor/subscription", icon: CreditCard },
];

export function DistributorSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const [configOpen, setConfigOpen] = useState(false);

  // Keep config group open if any config route is active
  useEffect(() => {
    if (location.pathname.startsWith("/distributor/settings") || location.pathname === "/distributor/subscription") {
      setConfigOpen(true);
    }
  }, [location.pathname]);

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <Logo size={open ? "md" : "sm"} />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${configOpen ? "rotate-180" : ""}`} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="pl-4">
                  {configItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavClass}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
