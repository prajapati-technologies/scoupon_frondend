import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ProtectedRouteProps } from './ProtectedRouteProps';
import { Loading } from './Loading';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading /> // You can replace this with a proper loading component
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if user role is not allowed
  if (!allowedRoles.includes(user!.utype)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};