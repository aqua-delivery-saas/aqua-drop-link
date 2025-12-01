import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    if (requiredRole === 'admin') return <Navigate to="/admin/login" replace />;
    if (requiredRole === 'distributor') return <Navigate to="/distributor/login" replace />;
    if (requiredRole === 'customer') return <Navigate to="/customer/login" replace />;
    return <Navigate to="/customer/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
