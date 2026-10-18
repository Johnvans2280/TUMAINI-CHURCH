import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, role, isAdminOrSecretary, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#111724]">
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8963E] mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Checking administrative authorization...
          </p>
        </div>
      </div>
    );
  }

  // Not signed in -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Signed in, but role is 'member' or not authorized for admin
  if (!isAdminOrSecretary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#111724] px-4 py-12">
        <div className="bg-white dark:bg-[#161F30] rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Access Restricted
          </h1>

          <p className="text-sm text-[#5B6270] dark:text-slate-300 leading-relaxed font-light">
            You are signed in as <strong className="font-semibold text-slate-800 dark:text-white">{user.email}</strong> with role{' '}
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {role || 'member'}
            </span>
            . Administrative portal access is restricted to pastoral and secretarial roles.
          </p>

          <p className="text-xs text-slate-400">
            Please contact your church administrator if your account requires elevated privileges.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center gap-2">
            <Link
              to="/"
              className="w-full min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <button
              onClick={() => signOut()}
              className="w-full min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
