import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Member, Hymn, DailyHymn, Announcement } from '../types';
import { initialHymns, initialAnnouncements, initialMembers, initialDailyHymns, getLocalTodayDateString } from './demoData';

// Local storage keys for fallback demo mode
const LS_MEMBERS_KEY = 'tumaini_members_data';
const LS_HYMNS_KEY = 'tumaini_hymns_data';
const LS_ANNOUNCEMENTS_KEY = 'tumaini_announcements_data';
const LS_DAILY_HYMNS_KEY = 'tumaini_daily_hymns_data';

// Helper to initialize or get local fallback store
function getLocalFallback<T>(key: string, initialData: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(stored);
  } catch {
    return initialData;
  }
}

function setLocalFallback<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed saving to localStorage', err);
  }
}

export const churchService = {
  // ==================== HYMNS ====================

  async getTodayHymn(): Promise<{ dailyHymn: DailyHymn | null; hymn: Hymn | null }> {
    const today = getLocalTodayDateString();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('daily_hymns')
          .select('*, hymns(*)')
          .eq('hymn_date', today)
          .maybeSingle();

        if (error) {
          console.warn('Supabase getTodayHymn error, falling back:', error.message);
        } else if (data) {
          return {
            dailyHymn: data,
            hymn: data.hymns || null
          };
        }
      } catch (err) {
        console.warn('Network error in getTodayHymn:', err);
      }
    }

    // Local fallback
    const dailyHymns = getLocalFallback<DailyHymn>(LS_DAILY_HYMNS_KEY, initialDailyHymns);
    const hymns = getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns);

    const match = dailyHymns.find((dh) => dh.hymn_date === today);
    if (match) {
      const hymnObj = hymns.find((h) => h.id === match.hymn_id) || match.hymns || null;
      return { dailyHymn: match, hymn: hymnObj };
    }

    return { dailyHymn: null, hymn: null };
  },

  async getAllHymns(): Promise<Hymn[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('hymns')
          .select('*')
          .order('hymn_number', { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
        if (error) {
          console.warn('Supabase getAllHymns error:', error.message);
        }
      } catch (err) {
        console.warn('Error fetching hymns from Supabase:', err);
      }
    }
    return getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns).sort((a, b) => a.hymn_number - b.hymn_number);
  },

  async getPastDailyHymns(): Promise<DailyHymn[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('daily_hymns')
          .select('*, hymns(*)')
          .order('hymn_date', { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Error fetching daily hymns from Supabase:', err);
      }
    }

    const dailyHymns = getLocalFallback<DailyHymn>(LS_DAILY_HYMNS_KEY, initialDailyHymns);
    const hymns = getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns);

    return dailyHymns.map((dh) => ({
      ...dh,
      hymns: hymns.find((h) => h.id === dh.hymn_id) || dh.hymns || null
    })).sort((a, b) => (b.hymn_date > a.hymn_date ? 1 : -1));
  },

  async addHymn(hymn: Omit<Hymn, 'id' | 'created_at'>): Promise<Hymn> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('hymns')
        .insert([hymn])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const hymns = getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns);
    const newHymn: Hymn = {
      ...hymn,
      id: 'hymn-' + Date.now(),
      created_at: new Date().toISOString()
    };
    hymns.push(newHymn);
    setLocalFallback(LS_HYMNS_KEY, hymns);
    return newHymn;
  },

  async updateHymn(id: string, updates: Partial<Hymn>): Promise<Hymn> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('hymns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const hymns = getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns);
    const idx = hymns.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error('Hymn not found');
    hymns[idx] = { ...hymns[idx], ...updates };
    setLocalFallback(LS_HYMNS_KEY, hymns);
    return hymns[idx];
  },

  async deleteHymn(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('hymns').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const hymns = getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns);
    setLocalFallback(
      LS_HYMNS_KEY,
      hymns.filter((h) => h.id !== id)
    );
  },

  async scheduleDailyHymn(hymnId: string, hymnDate: string): Promise<DailyHymn> {
    if (isSupabaseConfigured) {
      // Upsert on hymn_date unique constraint
      const { data, error } = await supabase
        .from('daily_hymns')
        .upsert(
          { hymn_id: hymnId, hymn_date: hymnDate },
          { onConflict: 'hymn_date' }
        )
        .select('*, hymns(*)')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const dailyHymns = getLocalFallback<DailyHymn>(LS_DAILY_HYMNS_KEY, initialDailyHymns);
    const hymns = getLocalFallback<Hymn>(LS_HYMNS_KEY, initialHymns);
    const selectedHymn = hymns.find((h) => h.id === hymnId) || null;

    const existingIdx = dailyHymns.findIndex((dh) => dh.hymn_date === hymnDate);
    const newEntry: DailyHymn = {
      id: existingIdx !== -1 ? dailyHymns[existingIdx].id : 'daily-' + Date.now(),
      hymn_id: hymnId,
      hymn_date: hymnDate,
      created_at: new Date().toISOString(),
      hymns: selectedHymn
    };

    if (existingIdx !== -1) {
      dailyHymns[existingIdx] = newEntry;
    } else {
      dailyHymns.push(newEntry);
    }

    setLocalFallback(LS_DAILY_HYMNS_KEY, dailyHymns);
    return newEntry;
  },

  // ==================== ANNOUNCEMENTS ====================

  async getAnnouncements(): Promise<Announcement[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data;
        }
        if (error) {
          console.warn('Supabase getAnnouncements error:', error.message);
        }
      } catch (err) {
        console.warn('Error fetching announcements from Supabase:', err);
      }
    }

    const list = getLocalFallback<Announcement>(LS_ANNOUNCEMENTS_KEY, initialAnnouncements);
    return [...list].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  },

  async addAnnouncement(ann: { title: string; body: string; is_pinned: boolean }): Promise<Announcement> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('announcements')
        .insert([ann])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const list = getLocalFallback<Announcement>(LS_ANNOUNCEMENTS_KEY, initialAnnouncements);
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title: ann.title,
      body: ann.body,
      is_pinned: ann.is_pinned,
      created_at: new Date().toISOString()
    };
    list.unshift(newAnn);
    setLocalFallback(LS_ANNOUNCEMENTS_KEY, list);
    return newAnn;
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const list = getLocalFallback<Announcement>(LS_ANNOUNCEMENTS_KEY, initialAnnouncements);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Announcement not found');
    list[idx] = { ...list[idx], ...updates };
    setLocalFallback(LS_ANNOUNCEMENTS_KEY, list);
    return list[idx];
  },

  async deleteAnnouncement(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const list = getLocalFallback<Announcement>(LS_ANNOUNCEMENTS_KEY, initialAnnouncements);
    setLocalFallback(
      LS_ANNOUNCEMENTS_KEY,
      list.filter((a) => a.id !== id)
    );
  },

  // ==================== MEMBERS ====================

  async getMembers(): Promise<Member[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('full_name', { ascending: true });

        if (!error && data) {
          return data;
        }
        if (error) {
          console.warn('Supabase getMembers error:', error.message);
        }
      } catch (err) {
        console.warn('Error fetching members from Supabase:', err);
      }
    }

    return getLocalFallback<Member>(LS_MEMBERS_KEY, initialMembers);
  },

  async addMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('members')
        .insert([member])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const members = getLocalFallback<Member>(LS_MEMBERS_KEY, initialMembers);
    const newMember: Member = {
      ...member,
      id: 'mem-' + Date.now(),
      created_at: new Date().toISOString()
    };
    members.push(newMember);
    setLocalFallback(LS_MEMBERS_KEY, members);
    return newMember;
  },

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const members = getLocalFallback<Member>(LS_MEMBERS_KEY, initialMembers);
    const idx = members.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Member not found');
    members[idx] = { ...members[idx], ...updates };
    setLocalFallback(LS_MEMBERS_KEY, members);
    return members[idx];
  },

  async deleteMember(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const members = getLocalFallback<Member>(LS_MEMBERS_KEY, initialMembers);
    setLocalFallback(
      LS_MEMBERS_KEY,
      members.filter((m) => m.id !== id)
    );
  },

  // ==================== DASHBOARD STATS ====================

  async getOverviewStats() {
    const today = getLocalTodayDateString();
    let members: Member[] = [];
    let todayHymnSet = false;

    try {
      members = await this.getMembers();
      const todayHymnRes = await this.getTodayHymn();
      todayHymnSet = Boolean(todayHymnRes.dailyHymn && todayHymnRes.hymn);
    } catch (err) {
      console.warn('Error computing overview stats:', err);
    }

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'active').length;

    // Check new members joined this calendar month
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newMembersThisMonth = members.filter((m) => {
      const dateToCheck = m.join_date || m.created_at;
      return dateToCheck && dateToCheck.startsWith(currentMonthPrefix);
    }).length;

    return {
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      todayHymnSet,
      todayDate: today
    };
  }
};
