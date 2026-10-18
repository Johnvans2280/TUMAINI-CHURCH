export type UserRole = 'admin' | 'secretary' | 'member';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at?: string;
}

export interface Member {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  date_of_birth: string | null;
  residence: string | null;
  ministry: string | null;
  join_date: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface Hymn {
  id: string;
  hymn_number: number;
  title: string;
  lyrics: string;
  language: string;
  created_at?: string;
}

export interface DailyHymn {
  id: string;
  hymn_id: string;
  hymn_date: string;
  created_at?: string;
  hymns?: Hymn | null;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  created_at: string;
}

export interface SiteSettings {
  id?: number;
  church_name: string | null;
  tagline: string | null;
  about: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  service_times: string | null;
  created_at?: string;
  updated_at?: string;
}
