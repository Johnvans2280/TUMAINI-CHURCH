# Tumaini Church Web App ("A community of hope")

A complete, production-ready, mobile-first church website and administrative portal built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

---

## Required Environment Variables

The application requires only two environment variables configured in a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Security Note:** Only the public `anon` key is used in the frontend. Never expose or use the `service_role` key.

If either variable is missing, the application automatically displays a clear setup screen naming the missing variable(s).

---

## Database Tables & Schema (Supabase)

This app reads and writes directly to the following Supabase tables:

```sql
-- 1. User Profiles & Role-Based Authorization ('admin' | 'secretary' | 'member')
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('admin', 'secretary', 'member')) default 'member',
  created_at timestamptz default now()
);

-- 2. Church Members Directory
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

-- 3. Hymnal Library
create table hymns (
  id uuid primary key default gen_random_uuid(),
  hymn_number int not null,
  title text not null,
  lyrics text not null,
  language text default 'English',
  created_at timestamptz default now()
);

-- 4. Daily Hymns Schedule (unique per date)
create table daily_hymns (
  id uuid primary key default gen_random_uuid(),
  hymn_id uuid references hymns(id) on delete cascade not null,
  hymn_date date unique not null,
  created_at timestamptz default now()
);

-- 5. Church Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_pinned boolean default false,
  created_at timestamptz default now()
);

-- 6. Church Details & Site Settings (Row id = 1)
create table site_settings (
  id int primary key default 1 check (id = 1),
  church_name text,
  tagline text,
  about text,
  phone text,
  email text,
  location text,
  service_times text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create `.env` in the root and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

3. **Start the local dev server:**
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
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
4. **SPA Routing Configuration:**
   A `vercel.json` file is already included at the root with SPA rewrites to ensure direct route visits and page refreshes work properly:
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
5. Click **Deploy**.
