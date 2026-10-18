import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../context/SettingsContext';
import { Menu, X, Sun, Moon, LogIn, LogOut, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdminOrSecretary, signOut, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const churchName = settings?.church_name || 'Tumaini Church';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
      isActive
        ? 'border-[#C8963E] text-[#1F2A44] dark:text-[#C8963E] font-semibold'
        : 'border-transparent text-slate-600 hover:text-[#1F2A44] dark:text-slate-300 dark:hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] flex items-center ${
      isActive
        ? 'bg-[#C8963E]/15 text-[#1F2A44] dark:text-[#C8963E] font-semibold'
        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#111724]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#1F2A44] dark:text-white font-serif-church whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
            aria-label={`${churchName} Homepage`}
          >
            <span>{churchName}</span>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/hymns" className={navLinkClass}>
              Hymns
            </NavLink>
            <NavLink to="/updates" className={navLinkClass}>
              Updates
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            {isAdminOrSecretary && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="flex items-center gap-1.5 text-[#C8963E]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin ({role})</span>
                </span>
              </NavLink>
            )}
          </nav>

          {/* Zone 3: Primary Actions (Theme Toggle + Login/Logout) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-600 hover:text-[#1F2A44] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E]"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode for evening hymn reading'}
            >
              {isDark ? <Sun className="w-5 h-5 text-[#C8963E]" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Desktop Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  title="Sign out of administrative account"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] dark:text-[#1F2A44] rounded-xl shadow-sm transition-all whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-[#FAF7F2] dark:bg-[#111724] px-4 pt-2 pb-6 space-y-1 shadow-xl animate-fade-in">
          <NavLink to="/" end onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/hymns" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            Hymns & Lyrics
          </NavLink>
          <NavLink to="/updates" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            Church Updates
          </NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
            About & Contact
          </NavLink>

          {isAdminOrSecretary && (
            <NavLink to="/admin" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
              <span className="flex items-center gap-2 text-[#C8963E] font-medium">
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard ({role})</span>
              </span>
            </NavLink>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full min-h-[44px] px-4 py-2.5 text-sm font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.email})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold text-center text-white bg-[#1F2A44] dark:bg-[#C8963E] dark:text-[#1F2A44] rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff & Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
