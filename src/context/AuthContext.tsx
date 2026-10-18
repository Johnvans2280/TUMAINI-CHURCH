import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserRole, Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  isAdminOrSecretary: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  loginAsDemoSecretary: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_AUTH_KEY = 'tumaini_demo_auth_profile';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile from 'profiles' table in Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user profile:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.warn('Network error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // First check for active Supabase session
      if (isSupabaseConfigured) {
        try {
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Get session error:', error.message);
          }

          if (mounted && currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            const userProfile = await fetchProfile(currentSession.user.id);
            if (mounted && userProfile) {
              setProfile(userProfile);
            }
          }
        } catch (err) {
          console.warn('Supabase auth initialization error:', err);
        }
      }

      // Check if demo auth was stored
      if (mounted) {
        try {
          const demoSaved = localStorage.getItem(DEMO_AUTH_KEY);
          if (demoSaved) {
            const parsed = JSON.parse(demoSaved);
            setProfile(parsed);
            // mock user
            setUser({
              id: parsed.id,
              email: parsed.email || 'admin@tumainichurch.org',
              app_metadata: {},
              user_metadata: { full_name: parsed.full_name },
              aud: 'authenticated',
              created_at: new Date().toISOString()
            } as User);
          }
        } catch {
          // ignore
        }
        setLoading(false);
      }

      // Supabase auth state change listener
      if (isSupabaseConfigured) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            const userProf = await fetchProfile(newSession.user.id);
            if (mounted) setProfile(userProf);
          } else {
            // Check if demo user is active before clearing profile
            const demoSaved = localStorage.getItem(DEMO_AUTH_KEY);
            if (!demoSaved && mounted) {
              setProfile(null);
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // If user is testing without Supabase configured yet:
      if (password.length >= 6) {
        const demoRole: UserRole = email.toLowerCase().includes('secretary') ? 'secretary' : 'admin';
        const demoProf: Profile = {
          id: 'demo-user-' + Date.now(),
          full_name: demoRole === 'admin' ? 'Pastor Samuel Baraka (Admin)' : 'Mary Ochieng (Secretary)',
          role: demoRole
        };
        localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoProf));
        setProfile(demoProf);
        setUser({
          id: demoProf.id,
          email,
          app_metadata: {},
          user_metadata: { full_name: demoProf.full_name },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User);
        return { error: null };
      } else {
        return { error: new Error('Password must be at least 6 characters') };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        const userProf = await fetchProfile(data.user.id);
        setProfile(userProf);
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'An unexpected error occurred during login') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_AUTH_KEY);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const loginAsDemoAdmin = () => {
    const demoProf: Profile = {
      id: 'demo-admin-id',
      full_name: 'Reverend Samuel (Admin)',
      role: 'admin'
    };
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoProf));
    setProfile(demoProf);
    setUser({
      id: demoProf.id,
      email: 'admin@tumainichurch.org',
      app_metadata: {},
      user_metadata: { full_name: demoProf.full_name },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User);
  };

  const loginAsDemoSecretary = () => {
    const demoProf: Profile = {
      id: 'demo-sec-id',
      full_name: 'Grace Mwangi (Secretary)',
      role: 'secretary'
    };
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoProf));
    setProfile(demoProf);
    setUser({
      id: demoProf.id,
      email: 'secretary@tumainichurch.org',
      app_metadata: {},
      user_metadata: { full_name: demoProf.full_name },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User);
  };

  const role = profile?.role || null;
  const isAdminOrSecretary = role === 'admin' || role === 'secretary';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        isAdminOrSecretary,
        isConfigured: isSupabaseConfigured,
        signInWithPassword,
        signOut,
        loginAsDemoAdmin,
        loginAsDemoSecretary
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
