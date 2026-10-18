import React, { useEffect, useState } from 'react';
import { churchService } from '../../lib/churchService';
import { Announcement } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  Plus,
  Pin,
  PinOff,
  Edit2,
  Trash2,
  Calendar,
  Search,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface AnnouncementFormData {
  title: string;
  body: string;
  is_pinned: boolean;
}

const emptyForm: AnnouncementFormData = {
  title: '',
  body: '',
  is_pinned: false
};

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [annToDelete, setAnnToDelete] = useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await churchService.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((a) => {
    const term = search.toLowerCase().trim();
    return (
      term === '' ||
      a.title.toLowerCase().includes(term) ||
      a.body.toLowerCase().includes(term)
    );
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setFormData({
      title: ann.title,
      body: ann.body,
      is_pinned: ann.is_pinned
    });
    setIsModalOpen(true);
  };

  const handleTogglePin = async (ann: Announcement) => {
    try {
      const updated = await churchService.updateAnnouncement(ann.id, {
        is_pinned: !ann.is_pinned
      });
      success(updated.is_pinned ? 'Announcement pinned to top' : 'Announcement unpinned');
      loadAnnouncements();
    } catch (err: any) {
      toastError(err.message || 'Failed to update pin status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      toastError('Title and announcement message are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await churchService.updateAnnouncement(editingId, {
          title: formData.title.trim(),
          body: formData.body.trim(),
          is_pinned: formData.is_pinned
        });
        success('Announcement updated.');
      } else {
        await churchService.addAnnouncement({
          title: formData.title.trim(),
          body: formData.body.trim(),
          is_pinned: formData.is_pinned
        });
        success('Announcement published.');
      }
      setIsModalOpen(false);
      loadAnnouncements();
    } catch (err: any) {
      toastError(err.message || 'Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!annToDelete) return;
    setIsDeleting(true);
    try {
      await churchService.deleteAnnouncement(annToDelete.id);
      success('Announcement removed.');
      setAnnToDelete(null);
      loadAnnouncements();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete announcement');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Church Announcements
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6270] dark:text-slate-400 mt-1">
            Create, update, and pin urgent news or event notices to the congregational feed.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="bg-white dark:bg-[#161F30] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements by keywords..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/60 dark:bg-[#1E273A] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
          />
        </div>
        <span className="text-xs text-[#5B6270] dark:text-slate-400 hidden sm:inline">
          {filteredAnnouncements.length} Notices
        </span>
      </div>

      {/* ANNOUNCEMENTS LIST */}
      {loading ? (
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8963E] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading notices...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-2">
          <Bell className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold font-serif-church text-slate-800 dark:text-slate-200">
            No announcements found
          </h3>
          <p className="text-xs text-slate-500">
            Click "New Announcement" to publish your first church notice.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white dark:bg-[#161F30] rounded-2xl p-5 sm:p-6 shadow-sm border transition-all ${
                ann.is_pinned
                  ? 'border-[#C8963E]/60 ring-1 ring-[#C8963E]/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {ann.is_pinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C8963E]/15 text-[#C8963E] text-xs font-semibold">
                      <Pin className="w-3 h-3 fill-[#C8963E]" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleTogglePin(ann)}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      ann.is_pinned
                        ? 'bg-[#C8963E]/10 text-[#C8963E] hover:bg-[#C8963E]/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={ann.is_pinned ? 'Unpin from top' : 'Pin to top of public feed'}
                  >
                    {ann.is_pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    <span>{ann.is_pinned ? 'Unpin' : 'Pin'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(ann)}
                    className="min-h-[36px] min-w-[36px] p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                    aria-label={`Edit ${ann.title}`}
                    title="Edit announcement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setAnnToDelete(ann)}
                    className="min-h-[36px] min-w-[36px] p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={`Delete ${ann.title}`}
                    title="Delete announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h2 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white mb-2">
                {ann.title}
              </h2>

              <p className="text-sm text-[#5B6270] dark:text-slate-300 whitespace-pre-line leading-relaxed font-light">
                {ann.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white dark:bg-[#161F30] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
                {editingId ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Combined Sunday Thanksgiving Service"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details & Information <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Provide date, time, location, and important notes for congregants..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="pin-checkbox"
                  type="checkbox"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                  className="w-4 h-4 text-[#C8963E] rounded border-slate-300 focus:ring-[#C8963E]"
                />
                <label htmlFor="pin-checkbox" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Pin this announcement to top of public homepage and updates feed
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] font-semibold flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {annToDelete && (
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
                Delete Announcement?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">"{annToDelete.title}"</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setAnnToDelete(null)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default AdminAnnouncements;
