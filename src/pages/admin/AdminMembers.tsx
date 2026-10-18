import React, { useEffect, useState } from 'react';
import { churchService } from '../../lib/churchService';
import { Member } from '../../types';
import { useToast } from '../../context/ToastContext';

const churchMinistries = [
  'Choir & Praise',
  'Ushering & Hospitality',
  'Youth Fellowship',
  'Sunday School',
  'Women of Hope',
  'Men\'s Fellowship',
  'Outreach & Missions',
  'Intercessory Prayer'
];
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Check,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface MemberFormData {
  full_name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  date_of_birth: string;
  residence: string;
  ministry: string;
  join_date: string;
  status: 'active' | 'inactive';
}

const emptyForm: MemberFormData = {
  full_name: '',
  phone: '',
  email: '',
  gender: '',
  date_of_birth: '',
  residence: '',
  ministry: '',
  join_date: new Date().toISOString().split('T')[0],
  status: 'active'
};

export const AdminMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm State
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await churchService.getMembers();
      setMembers(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Filter members
  const filteredMembers = members.filter((m) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      term === '' ||
      m.full_name.toLowerCase().includes(term) ||
      (m.phone && m.phone.toLowerCase().includes(term)) ||
      (m.email && m.email.toLowerCase().includes(term)) ||
      (m.residence && m.residence.toLowerCase().includes(term));

    const matchesMinistry = ministryFilter === 'all' || m.ministry === ministryFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

    return matchesSearch && matchesMinistry && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingMemberId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMemberId(m.id);
    setFormData({
      full_name: m.full_name,
      phone: m.phone || '',
      email: m.email || '',
      gender: (m.gender as any) || '',
      date_of_birth: m.date_of_birth || '',
      residence: m.residence || '',
      ministry: m.ministry || '',
      join_date: m.join_date || '',
      status: m.status
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toastError('Full name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMemberId) {
        await churchService.updateMember(editingMemberId, {
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          gender: (formData.gender as any) || null,
          date_of_birth: formData.date_of_birth || null,
          residence: formData.residence.trim() || null,
          ministry: formData.ministry.trim() || null,
          join_date: formData.join_date || null,
          status: formData.status
        });
        success('Member updated successfully');
      } else {
        await churchService.addMember({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          gender: (formData.gender as any) || null,
          date_of_birth: formData.date_of_birth || null,
          residence: formData.residence.trim() || null,
          ministry: formData.ministry.trim() || null,
          join_date: formData.join_date || null,
          status: formData.status
        });
        success('Member added successfully');
      }
      setIsModalOpen(false);
      loadMembers();
    } catch (err: any) {
      toastError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await churchService.deleteMember(memberToDelete.id);
      success(`Member "${memberToDelete.full_name}" deleted.`);
      setMemberToDelete(null);
      loadMembers();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export visible to CSV
  const handleExportCSV = () => {
    if (filteredMembers.length === 0) {
      toastError('No members to export.');
      return;
    }

    const headers = ['Full Name', 'Phone', 'Email', 'Gender', 'Date of Birth', 'Residence', 'Ministry', 'Join Date', 'Status'];
    const rows = filteredMembers.map((m) => [
      `"${m.full_name.replace(/"/g, '""')}"`,
      `"${(m.phone || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${m.gender || ''}"`,
      `"${m.date_of_birth || ''}"`,
      `"${(m.residence || '').replace(/"/g, '""')}"`,
      `"${(m.ministry || '').replace(/"/g, '""')}"`,
      `"${m.join_date || ''}"`,
      `"${m.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tumaini_church_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Exported ${filteredMembers.length} members to CSV`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Church Members Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6270] dark:text-slate-400 mt-1">
            Total registered members: <strong className="text-[#1F2A44] dark:text-white">{members.length}</strong> · Visible after filters: <strong className="text-[#C8963E]">{filteredMembers.length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E273A] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Download visible members as CSV"
          >
            <Download className="w-4 h-4 text-[#C8963E]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white dark:bg-[#161F30] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, residence..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/60 dark:bg-[#1E273A] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
            />
          </div>

          {/* Ministry Filter */}
          <div className="sm:col-span-3">
            <select
              value={ministryFilter}
              onChange={(e) => setMinistryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E273A] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
              aria-label="Filter by ministry"
            >
              <option value="all">All Ministries</option>
              {churchMinistries.map((min) => (
                <option key={min} value={min}>
                  {min}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E273A] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C8963E] min-h-[44px]"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* MEMBERS TABLE (Desktop) & CARDS (Mobile) */}
      {loading ? (
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8963E] mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading member records...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold font-serif-church text-slate-800 dark:text-slate-200">
            No church members found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or filters, or add a new member record.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-[#161F30] rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Full Name</th>
                  <th className="px-4 py-3.5">Contact Details</th>
                  <th className="px-4 py-3.5">Residence</th>
                  <th className="px-4 py-3.5">Ministry</th>
                  <th className="px-4 py-3.5">Join Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                      <div>{m.full_name}</div>
                      {m.gender && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {m.gender} {m.date_of_birth && `· Born ${m.date_of_birth}`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 space-y-0.5">
                      {m.phone && <div className="text-slate-800 dark:text-slate-300 font-mono text-[11px]">{m.phone}</div>}
                      {m.email && <div className="text-slate-500 text-[11px]">{m.email}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      {m.residence || '—'}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#1F2A44] dark:text-slate-200">
                      {m.ministry || 'General Congregation'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 tabular-nums">
                      {m.join_date || '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-slate-600 hover:text-[#1F2A44] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                          aria-label={`Edit ${m.full_name}`}
                          title="Edit member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setMemberToDelete(m)}
                          className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center"
                          aria-label={`Delete ${m.full_name}`}
                          title="Delete member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="lg:hidden space-y-3">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-[#161F30] p-4 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base text-[#1F2A44] dark:text-white">
                      {m.full_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <span>{m.ministry || 'General Member'}</span>
                      {m.gender && <span>· {m.gender}</span>}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  {m.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C8963E]" />
                      <a href={`tel:${m.phone}`} className="hover:underline font-mono">
                        {m.phone}
                      </a>
                    </div>
                  )}
                  {m.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  )}
                  {m.residence && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C8963E]" />
                      <span>{m.residence}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Joined: {m.join_date || 'N/A'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setMemberToDelete(m)}
                      className="min-h-[40px] px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 dark:bg-rose-950/40 flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white dark:bg-[#161F30] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
                {editingMemberId ? 'Edit Church Member' : 'Add New Member'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="min-h-[40px] min-w-[40px] p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Grace Wanjiru Kamau"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 712 345 678"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="grace@example.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Residence / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={formData.residence}
                    onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                    placeholder="e.g. Kilimani, Nairobi"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ministry / Fellowship
                  </label>
                  <select
                    value={formData.ministry}
                    onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  >
                    <option value="">Select Ministry (Optional)</option>
                    {churchMinistries.map((min) => (
                      <option key={min} value={min}>
                        {min}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    value={formData.join_date}
                    onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Membership Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-[#FAF7F2]/50 dark:bg-[#1E273A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C8963E]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingMemberId ? 'Save Changes' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {memberToDelete && (
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
                Delete Member Record?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">"{memberToDelete.full_name}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs"
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

export default AdminMembers;
