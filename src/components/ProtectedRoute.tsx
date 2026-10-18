import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAdminOrSecretary, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#111724]">
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8963E] mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Checking church administrative credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdminOrSecretary) {
    // Redirect unauthenticated or unauthorized users to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
