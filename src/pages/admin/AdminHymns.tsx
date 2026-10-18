import React, { useEffect, useState } from 'react';
import { churchService, getLocalTodayDateString } from '../../lib/churchService';
import { Hymn, DailyHymn } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  Clock,
  Sparkles,
  Loader2,
  X,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface HymnFormData {
  hymn_number: number | '';
  title: string;
  lyrics: string;
  language: string;
}

const emptyHymnForm: HymnFormData = {
  hymn_number: '',
  title: '',
  lyrics: '',
  language: 'English'
};

export const AdminHymns: React.FC = () => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [dailyHymns, setDailyHymns] = useState<DailyHymn[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit Hymn Modal
  const [isHymnModalOpen, setIsHymnModalOpen] = useState(false);
  const [editingHymnId, setEditingHymnId] = useState<string | null>(null);
  const [hymnForm, setHymnForm] = useState<HymnFormData>(emptyHymnForm);
  const [isSubmittingHymn, setIsSubmittingHymn] = useState(false);

  // Quick Schedule Modal / State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedHymnToSchedule, setSelectedHymnToSchedule] = useState<Hymn | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>(getLocalTodayDateString());
  const [isScheduling, setIsScheduling] = useState(false);

  // Delete Confirm
  const [hymnToDelete, setHymnToDelete] = useState<Hymn | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [allHymns, allDaily] = await Promise.all([
        churchService.getAllHymns(),
        churchService.getPastDailyHymns()
      ]);
      setHymns(allHymns);
      setDailyHymns(allDaily);
    } catch (err: any) {
      toastError(err.message || 'Failed to load hymns data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredHymns = hymns.filter((h) => {
    const term = search.toLowerCase().trim();
    return (
      term === '' ||
      h.title.toLowerCase().includes(term) ||
      String(h.hymn_number).includes(term) ||
      h.lyrics.toLowerCase().includes(term)
    );
  });

  const handleOpenAddHymn = () => {
    setEditingHymnId(null);
    // Auto-suggest next hymn number
    const maxNumber = hymns.reduce((max, h) => Math.max(max, h.hymn_number || 0), 0);
    setHymnForm({
      ...emptyHymnForm,
      hymn_number: maxNumber > 0 ? maxNumber + 1 : 1
    });
    setIsHymnModalOpen(true);
  };

  const handleOpenEditHymn = (h: Hymn) => {
    setEditingHymnId(h.id);
    setHymnForm({
      hymn_number: h.hymn_number,
      title: h.title,
      lyrics: h.lyrics,
      language: h.language || 'English'
    });
    setIsHymnModalOpen(true);
  };

  const handleSubmitHymn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hymnForm.title.trim() || !hymnForm.lyrics.trim() || hymnForm.hymn_number === '') {
      toastError('Please fill in hymn number, title, and lyrics.');
      return;
    }

    setIsSubmittingHymn(true);
    try {
      if (editingHymnId) {
        await churchService.updateHymn(editingHymnId, {
          hymn_number: Number(hymnForm.hymn_number),
          title: hymnForm.title.trim(),
          lyrics: hymnForm.lyrics.trim(),
          language: hymnForm.language.trim()
        });
        success(`Hymn #${hymnForm.hymn_number} updated.`);
      } else {
        await churchService.addHymn({
          hymn_number: Number(hymnForm.hymn_number),
          title: hymnForm.title.trim(),
          lyrics: hymnForm.lyrics.trim(),
          language: hymnForm.language.trim()
        });
        success(`Hymn #${hymnForm.hymn_number} added to library.`);
      }
      setIsHymnModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Failed saving hymn');
    } finally {
      setIsSubmittingHymn(false);
    }
  };

  const handleOpenSchedule = (hymn?: Hymn) => {
    setSelectedHymnToSchedule(hymn || hymns[0] || null);
    setScheduleDate(getLocalTodayDateString());
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHymnToSchedule || !scheduleDate) {
      toastError('Please select both a hymn and a date.');
      return;
    }

    setIsScheduling(true);
    try {
      await churchService.scheduleDailyHymn(selectedHymnToSchedule.id, scheduleDate);
      success(`Scheduled Hymn #${selectedHymnToSchedule.hymn_number} for ${scheduleDate}`);
      setIsScheduleModalOpen(false);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Failed to schedule hymn');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteHymn = async () => {
    if (!hymnToDelete) return;
    setIsDeleting(true);
    try {
      await churchService.deleteHymn(hymnToDelete.id);
      success(`Hymn #${hymnToDelete.hymn_number} deleted.`);
      setHymnToDelete(null);
      loadData();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete hymn');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sort upcoming and recent scheduled
  const upcomingDailyHymns = [...dailyHymns].sort((a, b) => b.hymn_date.localeCompare(a.hymn_date)).slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Hymns & Daily Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6270] dark:text-slate-400 mt-1">
            Maintain the hymnal repository and assign daily hymns for worship devotion (<span className="text-[#C8963E] font-medium">under 30 seconds</span>).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenSchedule()}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-[#C8963E] hover:bg-[#A5782A] text-[#1F2A44] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Daily Hymn</span>
          </button>

          <button
            onClick={handleOpenAddHymn}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#2A3958] dark:hover:bg-[#34466D] text-white shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hymn</span>
          </button>
        </div>
      </div>

      {/* SCHEDULED DAILY HYMNS BANNER STRIP */}
      <div className="bg-white dark:bg-[#161F30] rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C8963E]" />
            <h2 className="text-sm font-bold font-serif-church text-[#1F2A44] dark:text-white">
              Upcoming & Recent Scheduled Daily Hymns
            </h2>
          </div>
          <span className="text-xs text-slate-400">Unique per date</span>
        </div>

        {upcomingDailyHymns.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No daily hymns scheduled yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            {upcomingDailyHymns.map((dh) => (
              <div
                key={dh.id}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  dh.hymn_date === getLocalTodayDateString()
                    ? 'bg-[#C8963E]/10 border-[#C8963E]/40 text-[#1F2A44] dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-[11px] font-mono text-[#C8963E]">{dh.hymn_date}</span>
                    {dh.hymn_date === getLocalTodayDateString() && (
                      <span className="text-[9px] bg-[#C8963E] text-[#1F2A44] font-bold px-1.5 py-0.2 rounded uppercase">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="font-semibold truncate">
                    #{dh.hymns?.hymn_number} {dh.hymns?.title}
                  </p>
                </div>
                <div className="pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-700/40 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{dh.hymns?.language || 'English'}</span>
                  <button
                    onClick={() => {
                      if (dh.hymns) handleOpenSchedule(dh.hymns);
                    }}
                    className="text-[#C8963E] hover:underline"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALL HYMNS TABLE / SEARCH */}
      <div className="bg-white dark:bg-[#161F30] rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hymns by number, title, or lyric text..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/60 dark:bg-[#1E273A] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
            />
          </div>
          <span className="text-xs text-[#5B6270] dark:text-slate-400 self-center">
            {filteredHymns.length} Hymns in Library
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C8963E]" />
            <p className="text-xs">Loading hymns collection...</p>
          </div>
        ) : filteredHymns.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">No hymns found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredHymns.map((h) => (
              <div
                key={h.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1F2A44] dark:text-[#C8963E] font-serif-church font-bold text-base flex items-center justify-center shrink-0">
                    #{h.hymn_number}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold font-serif-church text-base text-[#1F2A44] dark:text-white">
                        {h.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {h.language || 'English'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B6270] dark:text-slate-400 line-clamp-1 mt-0.5 font-light">
                      {h.lyrics.split('\n')[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenSchedule(h)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#C8963E]/15 hover:bg-[#C8963E]/25 text-[#1F2A44] dark:text-[#C8963E] text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Schedule this hymn for a specific date"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditHymn(h)}
                    className="min-h-[38px] min-w-[38px] p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                    aria-label={`Edit ${h.title}`}
                    title="Edit lyrics or details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setHymnToDelete(h)}
                    className="min-h-[38px] min-w-[38px] p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center"
                    aria-label={`Delete ${h.title}`}
                    title="Delete hymn"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCHEDULE HYMN MODAL (<30 seconds workflow) */}
      {isScheduleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white dark:bg-[#161F30] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C8963E]" />
                <h2 className="text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
                  Schedule Daily Hymn
                </h2>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Hymn to Schedule
                </label>
                <select
                  value={selectedHymnToSchedule?.id || ''}
                  onChange={(e) => {
                    const match = hymns.find((h) => h.id === e.target.value);
                    setSelectedHymnToSchedule(match || null);
                  }}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
                >
                  {hymns.map((h) => (
                    <option key={h.id} value={h.id}>
                      #{h.hymn_number} - {h.title} ({h.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Date (Unique per date)
                </label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Rescheduling replaces any previously assigned hymn for this date automatically.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-[#C8963E] hover:bg-[#A5782A] text-[#1F2A44] font-semibold flex items-center gap-2 shadow-sm"
                >
                  {isScheduling && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT HYMN MODAL */}
      {isHymnModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white dark:bg-[#161F30] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
                {editingHymnId ? 'Edit Hymn' : 'Add New Hymn'}
              </h2>
              <button
                onClick={() => setIsHymnModalOpen(false)}
                className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHymn} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hymn Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={hymnForm.hymn_number}
                    onChange={(e) =>
                      setHymnForm({ ...hymnForm, hymn_number: e.target.value === '' ? '' : Number(e.target.value) })
                    }
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Language
                  </label>
                  <select
                    value={hymnForm.language}
                    onChange={(e) => setHymnForm({ ...hymnForm, language: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  >
                    <option value="English">English</option>
                    <option value="Swahili">Swahili</option>
                    <option value="Bilingual">Bilingual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hymn Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hymnForm.title}
                  onChange={(e) => setHymnForm({ ...hymnForm, title: e.target.value })}
                  placeholder="e.g. Amazing Grace"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lyrics & Stanzas <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={hymnForm.lyrics}
                  onChange={(e) => setHymnForm({ ...hymnForm, lyrics: e.target.value })}
                  placeholder="Enter stanzas and chorus. Separate verses with blank lines..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white font-serif-church focus:outline-none focus:ring-2 focus:ring-[#C8963E] leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHymnModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHymn}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] font-semibold flex items-center gap-2"
                >
                  {isSubmittingHymn && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingHymnId ? 'Update Hymn' : 'Add Hymn'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {hymnToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white dark:bg-[#161F30] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white">
                Delete Hymn?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">#{hymnToDelete.hymn_number} - {hymnToDelete.title}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setHymnToDelete(null)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHymn}
                disabled={isDeleting}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHymns;
