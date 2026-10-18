# Tumaini Church Web App ("A community of hope")

A complete, production-ready, mobile-first church website and administrative portal built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

---

## Features

1. **Public Congregation Portal**:
   - **Homepage (`/`)**: Hero section with service times, Today's Hymn live lookup (`daily_hymns` joined with `hymns`), and latest pinned announcements.
   - **Hymns & Lyrics (`/hymns`)**: Featured hymn of the day, searchable hymnal archive (search by number, title, or lyric lines), filterable by language (English, Swahili), and a full modal reader with accessible font-size scaling (**A- / A+**) and dark mode for evening devotions.
   - **Church Updates (`/updates`)**: Chronological announcement cards with pinned priority badges.
   - **About & Contact (`/about`)**: Church vision, active ministry groups, parish secretariat hours, contact lines, and map locator.
   - **Dark Mode**: High-contrast theme toggle for night-time Scripture and hymn singing.

2. **Protected Church Staff Dashboard (`/admin`)**:
   - **Role-Based Access Control**: Accessible exclusively to users with `'admin'` or `'secretary'` roles via `ProtectedRoute`.
   - **Overview (`/admin`)**: Metric cards for total members, active attendance, monthly new registrations, and Today's Hymn status.
   - **Member Directory (`/admin/members`)**: Full CRUD registry with search, ministry filters, active/inactive toggles, and one-click **CSV export**.
   - **Hymnal & Daily Scheduler (`/admin/hymns`)**: Add and edit hymns; schedule daily hymns with unique date upsert in under 30 seconds.
   - **Announcements Manager (`/admin/announcements`)**: Post, edit, delete, and pin notices to the public homepage.

---

## Database Tables & Schema (Supabase)

This app connects directly to existing Supabase tables with Row Level Security:

```sql
-- Profiles table for role-based authorization ('admin' | 'secretary' | 'member')
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('admin', 'secretary', 'member')) default 'member',
  created_at timestamptz default now()
);

-- Confidential Church Members Directory
create table members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  gender text check (gender in ('Male', 'Female', 'Other')),
  date_of_birth date,
  residence text,
  ministry text,
  join_date date default current_date,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

-- Hymnal Library
create table hymns (
  id uuid primary key default gen_random_uuid(),
  hymn_number int not null,
  title text not null,
  lyrics text not null,
  language text default 'English',
  created_at timestamptz default now()
);

-- Daily Hymns Schedule (unique per date)
create table daily_hymns (
  id uuid primary key default gen_random_uuid(),
  hymn_id uuid references hymns(id) on delete cascade not null,
  hymn_date date unique not null,
  created_at timestamptz default now()
);

-- Church Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_pinned boolean default false,
  created_at timestamptz default now()
);
```

---

## Required Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Security Note:** Only the public `anon` key is used in the frontend. Never expose or use the `service_role` key.

---

## Local Development Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd tumaini-church
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   *(If env variables are omitted, the app automatically runs in Demo Mode with pre-populated sample hymns and members for immediate evaluation).*

4. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

1. **Push your code to GitHub / GitLab / Bitbucket.**
2. **Import the repository into Vercel:**
   - In the Vercel dashboard, click **Add New...** → **Project**.
   - Select your repository.
3. **Configure Environment Variables in Vercel:**
   - Under **Settings** → **Environment Variables**, add:
     - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`
4. **SPA Routing Configuration:**
   A `vercel.json` file is already included at the root to handle client-side routing on hard refresh:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
5. Click **Deploy**. Your Tumaini Church web app is live!
