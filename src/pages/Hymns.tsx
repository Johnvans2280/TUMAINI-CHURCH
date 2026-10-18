import React, { useEffect, useState } from 'react';
import { churchService } from '../lib/churchService';
import { Hymn, DailyHymn } from '../types';
import HymnDetailModal from '../components/HymnDetailModal';
import { useToast } from '../context/ToastContext';
import { Search, BookOpen, Calendar, Filter, Sparkles, ChevronRight, Music, Bookmark } from 'lucide-react';

export const Hymns: React.FC = () => {
  const { error: toastError } = useToast();
  const [todayHymn, setTodayHymn] = useState<Hymn | null>(null);
  const [todayDate, setTodayDate] = useState<string>('');
  const [pastDailyHymns, setPastDailyHymns] = useState<DailyHymn[]>([]);
  const [allHymns, setAllHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'English' | 'Swahili'>('all');
  const [activeTab, setActiveTab] = useState<'daily' | 'all'>('daily');

  // Selected hymn for modal
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [{ dailyHymn, hymn }, pastDaily, hymns] = await Promise.all([
          churchService.getTodayHymn(),
          churchService.getPastDailyHymns(),
          churchService.getAllHymns()
        ]);
        setTodayHymn(hymn);
        setTodayDate(dailyHymn?.hymn_date || '');
        setPastDailyHymns(pastDaily);
        setAllHymns(hymns);
      } catch (err: any) {
        toastError(err.message || 'Failed to load hymns');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toastError]);

  // Filter daily hymns archive
  const filteredDailyHymns = pastDailyHymns.filter((dh) => {
    const hymn = dh.hymns;
    if (!hymn) return false;

    // Search query matches title or number
    const matchesSearch =
      searchQuery.trim() === '' ||
      hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(hymn.hymn_number).includes(searchQuery.trim()) ||
      hymn.lyrics.toLowerCase().includes(searchQuery.toLowerCase());

    // Language filter
    const matchesLang = languageFilter === 'all' || hymn.language === languageFilter;

    return matchesSearch && matchesLang;
  });

  // Filter all library hymns
  const filteredAllHymns = allHymns.filter((h) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(h.hymn_number).includes(searchQuery.trim()) ||
      h.lyrics.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLang = languageFilter === 'all' || h.language === languageFilter;

    return matchesSearch && matchesLang;
  });

  const handleOpenHymn = (hymn: Hymn, date?: string) => {
    setSelectedHymn(hymn);
    setSelectedDate(date || null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
          <Music className="w-3.5 h-3.5" />
          <span>Sacred Songbook</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
          Hymns & Lyrics
        </h1>
        <p className="text-sm sm:text-base text-[#5B6270] dark:text-slate-300">
          Sing praises together. Access daily scheduled hymns or explore the timeless hymnal library with adjustable reading sizes.
        </p>
      </div>

      {/* TODAY'S HYMN CARD FEATURED AT TOP */}
      {todayHymn ? (
        <section aria-labelledby="today-heading">
          <div className="bg-gradient-to-br from-[#1F2A44] to-[#141C2E] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8963E]/20 text-[#DFC07A] text-xs font-semibold border border-[#C8963E]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Today's Selected Hymn · {todayDate}</span>
                </span>
                <span className="text-xs text-slate-300">
                  Language: {todayHymn.language || 'English'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif-church text-2xl font-bold text-[#DFC07A]">
                      #{todayHymn.hymn_number}
                    </span>
                    <h2 id="today-heading" className="text-2xl sm:text-3xl font-bold font-serif-church">
                      {todayHymn.title}
                    </h2>
                  </div>
                  <p className="font-serif-church italic text-sm sm:text-base text-slate-200 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {todayHymn.lyrics.split('\n\n')[0]}
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center">
                  <button
                    onClick={() => handleOpenHymn(todayHymn, todayDate)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C8963E] hover:bg-[#A5782A] text-[#1F2A44] font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read Full Lyrics (A- / A+)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : !loading ? (
        <div className="bg-white dark:bg-[#1A2335] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
          <Bookmark className="w-8 h-8 text-[#C8963E] mx-auto mb-1" />
          <h2 className="text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            No hymn scheduled for today
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6270] dark:text-slate-400 max-w-md mx-auto">
            You can still browse, search, and sing from our hymnal collection below.
          </p>
        </div>
      ) : null}

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, hymn number, or lyrics snippet..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A2335] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Language and Tab Filter Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Tabs */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('daily')}
                className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'daily'
                    ? 'bg-white dark:bg-[#1A2335] text-[#1F2A44] dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Daily Archive ({filteredDailyHymns.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-[#1A2335] text-[#1F2A44] dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Full Hymnal ({filteredAllHymns.length})
              </button>
            </div>

            {/* Language Selector */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value as any)}
              className="min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A2335] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
              aria-label="Filter hymns by language"
            >
              <option value="all">All Languages</option>
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
            </select>
          </div>
        </div>
      </div>

      {/* HYMN LISTINGS */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white dark:bg-[#1A2335] rounded-2xl border border-slate-200 dark:border-slate-800 p-4" />
          ))}
        </div>
      ) : activeTab === 'daily' ? (
        /* Daily Archive View */
        filteredDailyHymns.length === 0 ? (
          <div className="bg-white dark:bg-[#1A2335] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold font-serif-church text-slate-800 dark:text-slate-200">
              No matching daily hymns found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search query or language filter, or explore the "Full Hymnal" tab.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDailyHymns.map((dh) => {
              const hymn = dh.hymns;
              if (!hymn) return null;
              return (
                <div
                  key={dh.id}
                  onClick={() => handleOpenHymn(hymn, dh.hymn_date)}
                  className="bg-white dark:bg-[#1A2335] hover:bg-[#FAF7F2] dark:hover:bg-[#1E293F] rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1F2A44] dark:text-[#C8963E] font-serif-church font-bold text-lg flex items-center justify-center shrink-0 group-hover:bg-[#C8963E]/20 transition-colors">
                      #{hymn.hymn_number}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#5B6270] dark:text-slate-400 mb-0.5">
                        <span className="flex items-center gap-1 font-medium text-[#C8963E]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dh.hymn_date}</span>
                        </span>
                        <span>·</span>
                        <span>{hymn.language || 'English'}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white group-hover:text-[#C8963E] transition-colors">
                        {hymn.title}
                      </h3>
                      <p className="text-xs text-[#5B6270] dark:text-slate-400 line-clamp-1 mt-0.5 font-light">
                        {hymn.lyrics.split('\n')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-semibold text-slate-500 group-hover:text-[#C8963E] transition-colors">
                      View Lyrics
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#C8963E] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Full Hymnal Library View */
        filteredAllHymns.length === 0 ? (
          <div className="bg-white dark:bg-[#1A2335] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold font-serif-church text-slate-800 dark:text-slate-200">
              No hymns match your criteria
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Search by hymn number or keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAllHymns.map((hymn) => (
              <div
                key={hymn.id}
                onClick={() => handleOpenHymn(hymn)}
                className="bg-white dark:bg-[#1A2335] hover:bg-[#FAF7F2] dark:hover:bg-[#1E293F] rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5B6270] dark:text-slate-400 mb-2">
                    <span className="font-semibold text-[#C8963E]">Hymn #{hymn.hymn_number}</span>
                    <span>{hymn.language || 'English'}</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white group-hover:text-[#C8963E] transition-colors mb-2">
                    {hymn.title}
                  </h3>
                  <p className="text-xs text-[#5B6270] dark:text-slate-300 line-clamp-3 whitespace-pre-line leading-relaxed font-light">
                    {hymn.lyrics.split('\n\n')[0]}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#1F2A44] dark:text-[#C8963E]">
                  <span>Open & Sing</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Hymn Detail Modal */}
      {selectedHymn && (
        <HymnDetailModal
          hymn={selectedHymn}
          scheduledDate={selectedDate}
          onClose={() => {
            setSelectedHymn(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default Hymns;
