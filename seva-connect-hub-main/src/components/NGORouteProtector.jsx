import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NGORouteProtector = ({ children }) => {
  const { user, ngoData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Loading NGO profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'ngo' && user.role !== 'admin') {
    return <Navigate to="/access-denied" replace />;
  }

  // Wait for NGO data if user belongs to NGO role
  if (user.role === 'ngo' && !ngoData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Synchronizing NGO profile...</p>
      </div>
    );
  }

  const { registrationCompleted, status } = ngoData || { registrationCompleted: false };

  // 1. If registration not completed, must go to register
  if (!registrationCompleted) {
    if (location.pathname !== '/ngo/register') {
      return <Navigate to="/ngo/register" replace />;
    }
    return children;
  }

  // 2. If registration completed, check status
  if (status === 'pending' || status === 'rejected') {
    if (location.pathname !== '/ngo/status') {
      return <Navigate to="/ngo/status" replace />;
    }
    return children;
  }

  // 3. If approved, allow access to dashboard or status (status can show approved too)
  if (status === 'approved') {
    // If they TRY to go to register or status, redirect to dashboard
    if (location.pathname === '/ngo/register' || location.pathname === '/ngo/status') {
      return <Navigate to="/ngo/dashboard" replace />;
    }
    return children;
  }

  return children;
};

export default NGORouteProtector;
