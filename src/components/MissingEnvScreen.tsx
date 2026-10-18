import React from 'react';
import { missingEnvVars } from '../lib/supabaseClient';
import { AlertTriangle, Key, Terminal } from 'lucide-react';

export const MissingEnvScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#111724] text-[#1F2A44] dark:text-white flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-xl border border-rose-200 dark:border-rose-900/60 space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Supabase Setup Required
          </h1>
          <p className="text-sm text-[#5B6270] dark:text-slate-300">
            The application cannot connect to your database because required environment variables are not configured.
          </p>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-200 uppercase tracking-wider">
            <Key className="w-4 h-4 text-rose-600" />
            <span>Missing Environment Variable{missingEnvVars.length > 1 ? 's' : ''}:</span>
          </div>
          <ul className="space-y-1.5 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 pl-4 list-disc">
            {missingEnvVars.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 text-xs text-[#5B6270] dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-[#C8963E]" />
            <span>How to resolve:</span>
          </p>
          <p>
            Create or update your <code>.env</code> file in the project root with your Supabase project credentials:
          </p>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`}
          </pre>
          <p className="text-[11px] text-slate-400">
            If deploying to Vercel or another host, add these exact keys under Project Settings &gt; Environment Variables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissingEnvScreen;
