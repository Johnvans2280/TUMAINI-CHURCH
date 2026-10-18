import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { churchService } from '../lib/churchService';
import { SiteSettings } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  saveSettings: (newSettings: Partial<SiteSettings>) => Promise<SiteSettings>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await churchService.getSiteSettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Error fetching site_settings:', err);
      setError(err.message || 'Failed to fetch church details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (newSettings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const updated = await churchService.updateSiteSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SettingsProvider');
  }
  return context;
};
