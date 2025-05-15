import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-background">
        <div className="cosmic-loading">
          <div className="cosmic-orbit">
            <div className="cosmic-satellite"></div>
          </div>
          <div className="cosmic-planet"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check for role requirements if specified
  if (requiredRole && user?.role !== requiredRole) {
    // Special case for educators who can access student resources
    if (requiredRole === 'student' && user?.role === 'educator') {
      return children;
    }
    
    // Special case for admins who can access all resources
    if (user?.role === 'admin') {
      return children;
    }
    
    // Otherwise redirect to dashboard if they don't have the required role
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authenticated with correct role
  return children;
};

export default ProtectedRoute;