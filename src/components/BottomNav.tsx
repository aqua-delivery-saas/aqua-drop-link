import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  path: string;
  icon: typeof LayoutDashboard;
}

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const isMobile = useIsMobile();
  const isKeyboardVisible = useKeyboardVisible();

  if (!isMobile) return null;

  return (
    <nav
      className={cn(
        "fixed bottom-3 left-3 right-3 z-50 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-[0_8px_24px_-4px_hsl(214_65%_11%/0.15)] transition-transform duration-200",
        isKeyboardVisible ? "translate-y-[150%]" : "translate-y-0"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                isActive
                  ? "text-primary bg-accent/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[11px] font-semibold tracking-wide">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
