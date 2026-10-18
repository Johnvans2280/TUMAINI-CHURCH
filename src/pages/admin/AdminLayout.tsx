import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, profile, role, signOut } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/members', label: 'Members', icon: Users, end: false },
    { to: '/admin/hymns', label: 'Hymns', icon: BookOpen, end: false },
    { to: '/admin/announcements', label: 'Announcements', icon: Bell, end: false },
    { to: '/admin/settings', label: 'Settings', icon: SettingsIcon, end: false }
  ];

  const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
    `min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#1F2A44] text-white dark:bg-[#C8963E] dark:text-[#1F2A44] font-semibold shadow-sm'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const mobileTabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center py-2 px-0.5 text-[10px] font-medium transition-colors min-h-[48px] ${
      isActive
        ? 'text-[#C8963E] font-semibold'
        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  const churchName = settings?.church_name || 'Church Portal';

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#111724] text-[#1F2A44] dark:text-white flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161F30] p-6 shrink-0 justify-between sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Brand & Portal Label */}
          <div>
            <Link to="/" className="block">
              <span className="font-serif-church font-bold text-xl text-[#1F2A44] dark:text-white line-clamp-1">
                {churchName}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#C8963E] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={sidebarLinkClass}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Actions */}
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {profile?.full_name || user?.email || 'Staff'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#C8963E]/20 text-[#C8963E] uppercase">
                {role || 'staff'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {user?.email}
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            className="min-h-[44px] flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Visit Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161F30]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center pb-safe"
        aria-label="Mobile admin tab bar"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={mobileTabClass}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="truncate max-w-[56px] text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
