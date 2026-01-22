import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, DollarSign, LogOut, Tags } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export function AdminSidebar() {
  const { logout } = useAuth();
  const { getCriticalAlerts } = useAdminNotifications();
  const criticalAlerts = getCriticalAlerts();

  const navItems = [
    { title: 'Início', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Usuários', path: '/admin/users', icon: Users },
    { title: 'Distribuidoras', path: '/admin/distributors', icon: Building2, badge: criticalAlerts.length },
    { title: 'Marcas', path: '/admin/brands', icon: Tags },
    { title: 'Relatórios Financeiros', path: '/admin/financial-reports', icon: DollarSign },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-card border-r min-h-screen flex-col">
      <div className="p-6 border-b">
        <Logo />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-body-md transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1">{item.title}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs animate-pulse">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
