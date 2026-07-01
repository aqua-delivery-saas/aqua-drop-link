import { ClipboardList, Home, UserRound } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const customerNavItems = [
  {
    title: "Início",
    path: "/",
    icon: Home,
  },
  {
    title: "Pedidos",
    path: "/customer/history",
    icon: ClipboardList,
  },
  {
    title: "Perfil",
    path: "/customer/profile",
    icon: UserRound,
  },
];

export function CustomerBottomNav() {
  return <BottomNav items={customerNavItems} />;
}