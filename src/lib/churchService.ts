import { supabase } from './supabaseClient';
import { Member, Hymn, DailyHymn, Announcement, SiteSettings } from '../types';

export const getLocalTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const churchService = {
  // ==================== SITE SETTINGS ====================

  async getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load site settings: ${error.message}`);
    }
    return data;
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const payload = {
      id: 1,
      ...settings,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save site settings: ${error.message}`);
    }
    return data;
  },

  // ==================== HYMNS ====================

  async getTodayHymn(): Promise<{ dailyHymn: DailyHymn | null; hymn: Hymn | null }> {
    const today = getLocalTodayDateString();

    const { data, error } = await supabase
      .from('daily_hymns')
      .select('*, hymns(*)')
      .eq('hymn_date', today)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load today's hymn: ${error.message}`);
    }

    if (!data) {
      return { dailyHymn: null, hymn: null };
    }

    return {
      dailyHymn: data,
      hymn: data.hymns || null
    };
  },

  async getAllHymns(): Promise<Hymn[]> {
    const { data, error } = await supabase
      .from('hymns')
      .select('*')
      .order('hymn_number', { ascending: true });

    if (error) {
      throw new Error(`Failed to load hymns: ${error.message}`);
    }
    return data || [];
  },

  async getPastDailyHymns(): Promise<DailyHymn[]> {
    const { data, error } = await supabase
      .from('daily_hymns')
      .select('*, hymns(*)')
      .order('hymn_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to load daily hymn archive: ${error.message}`);
    }
    return data || [];
  },

  async addHymn(hymn: Omit<Hymn, 'id' | 'created_at'>): Promise<Hymn> {
    const { data, error } = await supabase
      .from('hymns')
      .insert([hymn])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add hymn: ${error.message}`);
    }
    return data;
  },

  async updateHymn(id: string, updates: Partial<Hymn>): Promise<Hymn> {
    const { data, error } = await supabase
      .from('hymns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update hymn: ${error.message}`);
    }
    return data;
  },

  async deleteHymn(id: string): Promise<void> {
    const { error } = await supabase
      .from('hymns')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete hymn: ${error.message}`);
    }
  },

  async scheduleDailyHymn(hymnId: string, hymnDate: string): Promise<DailyHymn> {
    const { data, error } = await supabase
      .from('daily_hymns')
      .upsert(
        { hymn_id: hymnId, hymn_date: hymnDate },
        { onConflict: 'hymn_date' }
      )
      .select('*, hymns(*)')
      .single();

    if (error) {
      throw new Error(`Failed to schedule daily hymn: ${error.message}`);
    }
    return data;
  },

  // ==================== ANNOUNCEMENTS ====================

  async getAnnouncements(): Promise<Announcement[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load announcements: ${error.message}`);
    }
    return data || [];
  },

  async addAnnouncement(ann: { title: string; body: string; is_pinned: boolean }): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .insert([ann])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to publish announcement: ${error.message}`);
    }
    return data;
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update announcement: ${error.message}`);
    }
    return data;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete announcement: ${error.message}`);
    }
  },

  // ==================== MEMBERS ====================

  async getMembers(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to load members: ${error.message}`);
    }
    return data || [];
  },

  async addMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add member: ${error.message}`);
    }
    return data;
  },

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update member: ${error.message}`);
    }
    return data;
  },

  async deleteMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete member: ${error.message}`);
    }
  },

  // ==================== DASHBOARD STATS ====================

  async getOverviewStats() {
    const today = getLocalTodayDateString();

    const [members, todayHymnRes] = await Promise.all([
      this.getMembers(),
      this.getTodayHymn()
    ]);

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'active').length;

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
      todayHymnSet: Boolean(todayHymnRes.dailyHymn && todayHymnRes.hymn),
      todayDate: today
    };
  }
};
