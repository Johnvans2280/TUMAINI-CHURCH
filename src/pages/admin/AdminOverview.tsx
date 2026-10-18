import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { churchService } from '../../lib/churchService';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserCheck,
  UserPlus,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Bell,
  Sparkles
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newMembersThisMonth: 0,
    todayHymnSet: false,
    todayDate: ''
  });
  const [todayHymnTitle, setTodayHymnTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [overviewStats, todayHymnRes] = await Promise.all([
          churchService.getOverviewStats(),
          churchService.getTodayHymn()
        ]);
        setStats(overviewStats);
        if (todayHymnRes.hymn) {
          setTodayHymnTitle(`#${todayHymnRes.hymn.hymn_number} - ${todayHymnRes.hymn.title}`);
        }
      } catch (err) {
        console.error('Error fetching admin overview stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#161F30] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8963E] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Church Administration Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Welcome, {profile?.full_name || 'Church Staff'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6270] dark:text-slate-400 mt-1">
            Overview of congregation membership, daily hymnal ministry, and community updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/members"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1F2A44] hover:bg-[#151D30] dark:bg-[#C8963E] dark:hover:bg-[#A5782A] text-white dark:text-[#1F2A44] text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </Link>
          <Link
            to="/admin/hymns"
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E273A] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
          >
            <Calendar className="w-4 h-4 text-[#C8963E]" />
            <span>Schedule Hymn</span>
          </Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Members */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5B6270] dark:text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Total Members</span>
            <div className="w-8 h-8 rounded-xl bg-[#1F2A44]/10 dark:bg-slate-800 text-[#1F2A44] dark:text-slate-200 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white tabular-nums">
              {loading ? '...' : stats.totalMembers}
            </span>
            <p className="text-xs text-slate-500">Registered church members</p>
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5B6270] dark:text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Members</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold font-serif-church text-emerald-600 dark:text-emerald-400 tabular-nums">
              {loading ? '...' : stats.activeMembers}
            </span>
            <p className="text-xs text-slate-500">
              {stats.totalMembers > 0
                ? `${Math.round((stats.activeMembers / stats.totalMembers) * 100)}% active attendance`
                : 'Active status'}
            </p>
          </div>
        </div>

        {/* New Members This Month */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5B6270] dark:text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">New This Month</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white tabular-nums">
              {loading ? '...' : stats.newMembersThisMonth}
            </span>
            <p className="text-xs text-slate-500">Welcomed into fellowship</p>
          </div>
        </div>

        {/* Today's Hymn Status */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5B6270] dark:text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Today's Hymn</span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                stats.todayHymnSet
                  ? 'bg-[#C8963E]/20 text-[#C8963E]'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              {stats.todayHymnSet ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Set & Scheduled
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Not Set
                  </span>
                </>
              )}
            </div>
            {todayHymnTitle ? (
              <p className="text-xs text-[#5B6270] dark:text-slate-400 truncate font-serif-church">
                {todayHymnTitle}
              </p>
            ) : (
              <Link
                to="/admin/hymns"
                className="text-xs font-semibold text-[#C8963E] hover:underline inline-flex items-center gap-1"
              >
                <span>Quick schedule today</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & MODULE PREVIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Management Card */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#1F2A44]/10 dark:bg-slate-800 text-[#1F2A44] dark:text-white flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-[#C8963E]" />
            </div>
            <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white">
              Church Members
            </h3>
            <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-1 leading-relaxed">
              Maintain the confidential member registry, filter by ministry, track join dates, and export CSV reports.
            </p>
          </div>
          <Link
            to="/admin/members"
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>Open Members Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hymn Scheduler Card */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#C8963E]/15 text-[#C8963E] flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white">
              Daily Hymnal Ministry
            </h3>
            <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-1 leading-relaxed">
              Add new hymns, edit lyrics, and schedule daily hymns for the congregation in under 30 seconds.
            </p>
          </div>
          <Link
            to="/admin/hymns"
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>Manage & Schedule Hymns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Announcements Card */}
        <div className="bg-white dark:bg-[#161F30] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white">
              Announcements & Notices
            </h3>
            <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-1 leading-relaxed">
              Publish church news, pin urgent notices to the top, and keep congregants informed on upcoming events.
            </p>
          </div>
          <Link
            to="/admin/announcements"
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
          >
            <span>Manage Announcements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
