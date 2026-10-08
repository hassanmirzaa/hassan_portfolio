-- ============================================================
-- 02_tables.sql        SAFE: creates what is missing, adds missing columns.
-- It NEVER drops or changes existing data. Works on your current database
-- (adds the new columns) and on an empty one (creates everything).
-- Run AFTER 01.
-- ============================================================


-- ───────────── PROJECTS ─────────────
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  description     text not null,
  created_at      timestamptz not null default now()
);

alter table public.projects
  add column if not exists summary         text,                                  -- one line, shown in the work list
  add column if not exists long_description text,                                 -- legacy, merged into description in file 09
  add column if not exists role            text,                                  -- what I did
  add column if not exists problem         text,                                  -- case study: the brief
  add column if not exists approach        text,                                  -- case study: decisions and tradeoffs
  add column if not exists outcome         text,                                  -- case study: result (real numbers only)
  add column if not exists cover_image     text,
  add column if not exists demo_video      text,
  add column if not exists screens         jsonb not null default '[]'::jsonb,    -- [{"url":"...","caption":"..."}]
  add column if not exists category        text not null default 'Mobile App',
  add column if not exists metrics         text,
  add column if not exists tech_stack      text[] not null default '{}',
  add column if not exists play_store_url  text,
  add column if not exists app_store_url   text,
  add column if not exists github_url      text,
  add column if not exists live_url        text,
  add column if not exists year            text,
  add column if not exists accent_color    text not null default '#17403A',       -- hover card colour on the work list
  add column if not exists status          text not null default 'live',
  add column if not exists is_confidential boolean not null default false,        -- true = screenshots must be anonymised
  add column if not exists sort_order      int not null default 0,
  add column if not exists is_featured     boolean not null default true,
  add column if not exists is_published    boolean not null default true,
  add column if not exists updated_at      timestamptz not null default now();

do $$ begin
  alter table public.projects add constraint projects_status_check
    check (status in ('live', 'in_development', 'archived'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.projects add constraint projects_accent_hex
    check (accent_color ~ '^#[0-9A-Fa-f]{6}$');
exception when duplicate_object then null; end $$;

create index if not exists idx_projects_published_sort on public.projects (is_published, sort_order, created_at desc);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- ───────────── BLOGS ─────────────
create table if not exists public.blogs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  content     text not null,
  created_at  timestamptz not null default now()
);

alter table public.blogs
  add column if not exists excerpt         text,
  add column if not exists cover_image     text,
  add column if not exists category        text default 'General',
  add column if not exists tags            text[] default '{}',
  add column if not exists author          text default 'Hassan Mirza',
  add column if not exists reading_minutes int,                                   -- optional override, otherwise calculated
  add column if not exists sort_order      int default 0,
  add column if not exists is_published    boolean default true,
  add column if not exists published_at    timestamptz default now(),
  add column if not exists updated_at      timestamptz not null default now();

create index if not exists idx_blogs_published on public.blogs (is_published, published_at desc);

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();


-- ───────────── LEADS (contact form + chatbot) ─────────────
create table if not exists public.portfolio_leads (
  id          bigint generated always as identity primary key,
  name        text not null,
  source      text not null default 'contact_form',
  created_at  timestamptz not null default now()
);

alter table public.portfolio_leads
  add column if not exists email        text,
  add column if not exists phone        text,
  add column if not exists message      text,
  add column if not exists project_type text,                                     -- what they need (form dropdown)
  add column if not exists budget       text,
  add column if not exists call_date    text,                                     -- chatbot bookings
  add column if not exists call_time    text,
  add column if not exists status       text not null default 'new',
  add column if not exists notes        text,
  add column if not exists handled_at   timestamptz;

do $$ begin
  alter table public.portfolio_leads add constraint leads_status_check
    check (status in ('new', 'contacted', 'won', 'lost'));
exception when duplicate_object then null; end $$;

-- NOT VALID = enforced for new rows only; your existing rows are not re-checked.
do $$ begin
  alter table public.portfolio_leads add constraint leads_limits check (
        char_length(name) between 1 and 200
    and (email        is null or char_length(email)        <= 320)
    and (phone        is null or char_length(phone)        <= 50)
    and (message      is null or char_length(message)      <= 5000)
    and (project_type is null or char_length(project_type) <= 100)
  ) not valid;
exception when duplicate_object then null; end $$;

create index if not exists idx_leads_status_created on public.portfolio_leads (status, created_at desc);


-- ───────────── SITE SETTINGS (single row, edited from the admin) ─────────────
create table if not exists public.site_settings (
  id            int primary key default 1 check (id = 1),
  contact_email text,
  github_url    text,
  linkedin_url  text,
  instagram_url text,
  upwork_url    text,
  is_available  boolean not null default true,
  available_from text,                                                            -- e.g. 'November 2026' (header pill)
  updated_at    timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id, contact_email, github_url, linkedin_url, upwork_url)
values (
  1,
  'hassanmirza0801@gmail.com',
  'https://github.com/hassanmirzaa',
  'https://www.linkedin.com/in/hassan-mirza-',
  'https://www.upwork.com/freelancers/~01667255a108dfd384?mp_source=share'
)
on conflict (id) do nothing;
