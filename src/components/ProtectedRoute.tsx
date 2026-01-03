import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, isLoading, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (requiredRole === 'admin') return <Navigate to="/admin/login" replace />;
    if (requiredRole === 'distributor') return <Navigate to="/distributor/login" replace />;
    if (requiredRole === 'customer') return <Navigate to="/customer/login" replace />;
    return <Navigate to="/customer/login" replace />;
  }

  // Get role from auth state
  const { role } = useAuth.getState();

  // If authenticated but role is still loading, show loading state
  if (requiredRole && role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Only redirect to 403 if role is loaded and doesn't match
  if (requiredRole && role !== null && !hasRole(requiredRole)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
