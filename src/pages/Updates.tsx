import React, { useEffect, useState } from 'react';
import { churchService } from '../lib/churchService';
import { Announcement } from '../types';
import { useToast } from '../context/ToastContext';
import { Pin, Calendar, Search, Bell } from 'lucide-react';

export const Updates: React.FC = () => {
  const { error: toastError } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pinned'>('all');

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        const data = await churchService.getAnnouncements();
        setAnnouncements(data);
      } catch (err: any) {
        toastError(err.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, [toastError]);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.body.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || (filterType === 'pinned' && ann.is_pinned);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
          <Bell className="w-3.5 h-3.5" />
          <span>Church News & Announcements</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
          Church Updates
        </h1>
        <p className="text-sm sm:text-base text-[#5B6270] dark:text-slate-300">
          Stay informed with ministry announcements, community outreach programs, and fellowship events.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements by keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A2335] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
          />
        </div>

        <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`min-h-[36px] px-4 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-white dark:bg-[#1A2335] text-[#1F2A44] dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All Updates ({announcements.length})
          </button>
          <button
            onClick={() => setFilterType('pinned')}
            className={`min-h-[36px] px-4 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterType === 'pinned'
                ? 'bg-white dark:bg-[#1A2335] text-[#1F2A44] dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Pinned Notices ({announcements.filter((a) => a.is_pinned).length})
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-white dark:bg-[#1A2335] rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
              <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-white dark:bg-[#1A2335] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            No updates found
          </h3>
          <p className="text-sm text-[#5B6270] dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'No announcements matched your search.' : 'There are currently no active church announcements.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((ann) => (
            <article
              key={ann.id}
              className={`bg-white dark:bg-[#1A2335] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border transition-all ${
                ann.is_pinned
                  ? 'border-[#C8963E]/60 ring-1 ring-[#C8963E]/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-[#5B6270] dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-[#C8963E]" />
                  <time dateTime={ann.created_at} className="font-medium">
                    {new Date(ann.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>

                {ann.is_pinned && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8963E]/10 text-[#C8963E] text-xs font-semibold border border-[#C8963E]/20">
                    <Pin className="w-3.5 h-3.5 fill-[#C8963E]" />
                    <span>Pinned Announcement</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif-church text-[#1F2A44] dark:text-white mb-3">
                {ann.title}
              </h2>

              <div className="text-base text-[#1F2A44]/90 dark:text-slate-300 whitespace-pre-line leading-relaxed font-light">
                {ann.body}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;
