import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { Settings as SettingsIcon, Save, Loader2, Building2, Phone, Mail, MapPin, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, loading, saveSettings } = useSiteSettings();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    church_name: '',
    tagline: '',
    about: '',
    phone: '',
    email: '',
    location: '',
    service_times: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        church_name: settings.church_name || '',
        tagline: settings.tagline || '',
        about: settings.about || '',
        phone: settings.phone || '',
        email: settings.email || '',
        location: settings.location || '',
        service_times: settings.service_times || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings({
        church_name: formData.church_name.trim() || null,
        tagline: formData.tagline.trim() || null,
        about: formData.about.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        location: formData.location.trim() || null,
        service_times: formData.service_times.trim() || null
      });
      success('Church details saved successfully');
    } catch (err: any) {
      toastError(err.message || 'Failed to update church details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8963E] mx-auto mb-3" />
        <p className="text-sm">Loading church settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8963E] mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Site Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
          Church Details & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6270] dark:text-slate-400 mt-1">
          Update the congregation name, tagline, service times, and contact information saved in the <code>site_settings</code> database table.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Brand Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C8963E]" />
              <span>Church Identity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Church Name
                </label>
                <input
                  type="text"
                  value={formData.church_name}
                  onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
                  placeholder="e.g. Tumaini Church"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. A community of hope"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                About Description / Welcome Message
              </label>
              <textarea
                rows={4}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Share your church vision, mission, and welcoming message for visitors..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E] leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed in the Hero and About sections. If left empty, that section is hidden.
              </p>
            </div>
          </div>

          {/* Service Times */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C8963E]" />
              <span>Service Times</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Worship & Fellowship Schedule
              </label>
              <textarea
                rows={4}
                value={formData.service_times}
                onChange={(e) => setFormData({ ...formData, service_times: e.target.value })}
                placeholder={`Sunday Morning Worship: 9:00 AM - 10:30 AM&#10;Sunday Main Service: 11:00 AM - 12:30 PM&#10;Wednesday Prayer Meeting: 6:00 PM`}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E] font-mono text-xs leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter each service on a new line. If empty, the Service Times section on the public site will be hidden.
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C8963E]" />
              <span>Contact & Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +254 700 000 000"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. office@yourchurch.org"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Physical Location / Address
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Community Greens, Nairobi"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="min-h-[48px] px-8 py-2.5 rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] font-semibold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
