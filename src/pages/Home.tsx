import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { churchService } from '../lib/churchService';
import { Hymn, DailyHymn, Announcement } from '../types';
import HymnDetailModal from '../components/HymnDetailModal';
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Volume2,
  Bookmark,
  Pin,
  ChevronRight,
  BookOpen,
  MapPin,
  Phone
} from 'lucide-react';

export const Home: React.FC = () => {
  const { settings } = useSiteSettings();
  const { error: toastError } = useToast();

  const [todayHymn, setTodayHymn] = useState<Hymn | null>(null);
  const [dailyHymnRecord, setDailyHymnRecord] = useState<DailyHymn | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [{ dailyHymn, hymn }, allAnnouncements] = await Promise.all([
          churchService.getTodayHymn(),
          churchService.getAnnouncements()
        ]);
        setDailyHymnRecord(dailyHymn);
        setTodayHymn(hymn);
        setAnnouncements(allAnnouncements.slice(0, 3));
      } catch (err: any) {
        toastError(err.message || 'Failed to load home page content');
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, [toastError]);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const churchName = settings?.church_name || 'Tumaini Church';
  const tagline = settings?.tagline;
  const aboutText = settings?.about;
  const phone = settings?.phone;
  const location = settings?.location;
  const serviceTimes = settings?.service_times;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE1]/60 to-[#FAF7F2] dark:from-[#111724] dark:via-[#161F30] dark:to-[#111724]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              {tagline && (
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#C8963E] bg-[#C8963E]/10 px-3 py-1.5 rounded-full border border-[#C8963E]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tagline}</span>
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-church text-[#1F2A44] dark:text-white tracking-tight leading-[1.15]">
                {churchName}
              </h1>

              {aboutText && (
                <p className="text-lg sm:text-xl text-[#5B6270] dark:text-slate-300 leading-relaxed max-w-2xl font-light whitespace-pre-line">
                  {aboutText}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#todays-hymn"
                  className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Today's Hymn</span>
                </a>

                <a
                  href="#updates"
                  className="min-h-[48px] px-6 py-3 rounded-2xl bg-white dark:bg-[#1E273A] border border-slate-200 dark:border-slate-700 text-[#1F2A44] dark:text-slate-200 font-semibold text-sm hover:border-[#C8963E] dark:hover:border-[#C8963E] shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Latest Updates</span>
                  <ArrowRight className="w-4 h-4 text-[#C8963E]" />
                </a>
              </div>

              {/* Quick Info Strip (only if location or phone exists) */}
              {(location || phone) && (
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-[#5B6270] dark:text-slate-400">
                  {location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C8963E]" />
                      <span>{location}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#C8963E]" />
                      <a href={`tel:${phone}`} className="hover:underline">
                        {phone}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Hero Sanctuary Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 group">
                <img
                  src="/src/assets/images/church_sanctuary_warm_1792311944301.jpg"
                  alt="Church sanctuary warm interior"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#DFC07A] font-medium">Sanctuary of Worship</span>
                  <p className="font-serif-church text-lg sm:text-xl font-semibold mt-1">
                    "Enter His gates with thanksgiving and His courts with praise."
                  </p>
                  <span className="text-xs text-slate-300 mt-1">Psalm 100:4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S HYMN SECTION */}
      <section id="todays-hymn" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
            <Volume2 className="w-4 h-4" />
            <span>Spiritual Song for Today</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Today's Hymn
          </h2>
          <p className="text-sm text-[#5B6270] dark:text-slate-400">
            {todayFormatted}
          </p>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-[#1A2335] rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 dark:border-slate-800 text-center animate-pulse">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto mb-6"></div>
            <div className="space-y-3 max-w-md mx-auto">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5 mx-auto"></div>
            </div>
          </div>
        ) : todayHymn ? (
          <div className="relative bg-white dark:bg-[#1A2335] rounded-3xl shadow-md border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all hover:shadow-lg">
            {/* Top decorative accent bar */}
            <div className="h-2 bg-[#C8963E]" />

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C8963E]/15 text-[#C8963E] font-serif-church font-bold text-xl">
                    #{todayHymn.hymn_number}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[#5B6270] dark:text-slate-400 uppercase tracking-wide">
                      {todayHymn.language || 'English'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
                      {todayHymn.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHymn(todayHymn)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 text-[#1F2A44] dark:text-white hover:bg-[#C8963E] hover:text-white dark:hover:bg-[#C8963E] dark:hover:text-[#1F2A44] font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Full Lyrics (A- / A+)</span>
                </button>
              </div>

              {/* Lyrics Preview */}
              <div className="py-8 text-center sm:text-left">
                <div className="max-w-xl mx-auto font-serif-church text-lg sm:text-xl text-[#1F2A44]/90 dark:text-slate-200 whitespace-pre-line leading-relaxed sm:leading-loose">
                  {todayHymn.lyrics.split('\n\n').slice(0, 2).join('\n\n')}
                  {todayHymn.lyrics.split('\n\n').length > 2 && '\n\n...'}
                </div>
              </div>

              {/* Hymn Card Actions */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#5B6270] dark:text-slate-400">
                  Sing along during personal devotion or family worship.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedHymn(todayHymn)}
                    className="flex-1 sm:flex-none min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1F2A44] dark:bg-[#C8963E] text-white dark:text-[#1F2A44] font-semibold text-sm hover:opacity-95 transition-all text-center"
                  >
                    Open Hymn Reader
                  </button>
                  <Link
                    to="/hymns"
                    className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
                  >
                    View All Hymns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-[#1A2335] rounded-3xl p-10 sm:p-14 shadow-sm border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C8963E]/10 text-[#C8963E] flex items-center justify-center mx-auto">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
              No hymn scheduled for today
            </h3>
            <p className="text-sm text-[#5B6270] dark:text-slate-400 max-w-md mx-auto">
              No daily hymn has been assigned for today yet. You can still browse and search our hymn archive!
            </p>
            <div className="pt-2">
              <Link
                to="/hymns"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1F2A44] dark:bg-[#C8963E] text-white dark:text-[#1F2A44] font-semibold text-sm hover:opacity-90 transition-all"
              >
                <span>Browse Hymn Archive</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 3. LATEST ANNOUNCEMENTS / UPDATES */}
      <section id="updates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
              <Pin className="w-3.5 h-3.5" />
              <span>Church Life & Fellowship</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-church text-[#1F2A44] dark:text-white mt-1">
              Latest Updates
            </h2>
          </div>
          <Link
            to="/updates"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8963E] hover:text-[#A5782A] dark:hover:text-[#DFC07A] transition-colors"
          >
            <span>View All Announcements</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-white dark:bg-[#1A2335] rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white dark:bg-[#1A2335] rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No active announcements at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white dark:bg-[#1A2335] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5B6270] dark:text-slate-400 mb-3">
                    <span className="font-medium">
                      {new Date(ann.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {ann.is_pinned && (
                      <span className="inline-flex items-center gap-1 text-[#C8963E] font-semibold">
                        <Pin className="w-3 h-3 fill-[#C8963E]" />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white leading-snug mb-2">
                    {ann.title}
                  </h3>

                  <p className="text-sm text-[#5B6270] dark:text-slate-300 line-clamp-4 leading-relaxed font-light">
                    {ann.body}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    to="/updates"
                    className="text-xs font-semibold text-[#1F2A44] dark:text-[#C8963E] hover:underline flex items-center gap-1"
                  >
                    <span>Read details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. SERVICE TIMES SECTION (Hidden if service_times is empty) */}
      {serviceTimes && serviceTimes.trim() && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1F2A44] dark:bg-[#151D2C] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
              <span className="text-xs uppercase tracking-widest text-[#DFC07A] font-semibold">
                Join Us For Worship
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-church">
                Worship Times & Gatherings
              </h2>
            </div>

            <div className="bg-[#273554] dark:bg-[#1C273B] rounded-2xl p-6 sm:p-8 border border-slate-700/60 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-[#DFC07A] text-xs font-semibold uppercase tracking-wider mb-4">
                <Clock className="w-4 h-4" />
                <span>Service Schedule</span>
              </div>
              <div className="text-base text-slate-100 whitespace-pre-line leading-relaxed font-light">
                {serviceTimes}
              </div>
            </div>

            {(phone || location) && (
              <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
                <p>
                  {location ? `Join us at ${location}.` : 'You are warmly welcome to worship with us.'}
                </p>
                {phone && (
                  <div className="flex items-center gap-4">
                    <a
                      href={`tel:${phone}`}
                      className="text-[#DFC07A] hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{phone}</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hymn Modal View */}
      {selectedHymn && (
        <HymnDetailModal
          hymn={selectedHymn}
          scheduledDate={dailyHymnRecord?.hymn_date}
          onClose={() => setSelectedHymn(null)}
        />
      )}
    </div>
  );
};

export default Home;
