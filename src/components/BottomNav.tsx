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
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md transition-transform duration-200",
        isKeyboardVisible ? "translate-y-[150%]" : "translate-y-0"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-[60px] transition-colors water-press",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.6} fill={isActive ? "currentColor" : "none"} />
                <span className={cn("text-[11px]", isActive ? "font-bold" : "font-medium")}>
                  {item.title}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
