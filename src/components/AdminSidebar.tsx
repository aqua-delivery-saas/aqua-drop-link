import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, DollarSign, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export function AdminSidebar() {
  const { logout } = useAuth();
  const { getCriticalAlerts } = useAdminNotifications();
  const criticalAlerts = getCriticalAlerts();

  const navItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Usuários', path: '/admin/users', icon: Users },
    { title: 'Distribuidoras', path: '/admin/distributors', icon: Building2, badge: criticalAlerts.length },
    { title: 'Relatórios Financeiros', path: '/admin/financial-reports', icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-300 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-300">
        <Logo />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-body-md transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
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

      <div className="p-4 border-t border-gray-300">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md text-gray-600 hover:bg-gray-100 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
