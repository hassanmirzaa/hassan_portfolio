-- ============================================================
-- 03_security_policies.sql        SAFE: replaces ALL old policies on these tables.
-- Run AFTER 01 and 02.
--
-- Rules:
--   Visitors (not logged in):  read PUBLISHED projects and blogs, read site settings,
--                              INSERT a lead (validated). Nothing else.
--   Admins (listed in admin_users): everything.
--   Any other logged-in user:  same as a visitor. "Logged in" alone grants nothing.
--
-- Admin check is written inline (reads admin_users directly), so it does not depend on is_admin().
-- ============================================================

-- Remove every old policy on these tables (your two earlier SQL files created differently named ones).
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('projects', 'blogs', 'portfolio_leads', 'site_settings')
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

alter table public.projects        enable row level security;
alter table public.blogs           enable row level security;
alter table public.portfolio_leads enable row level security;
alter table public.site_settings   enable row level security;


-- ───────────── projects ─────────────
create policy "Public reads published projects" on public.projects
  for select to anon, authenticated
  using (is_published = true);

create policy "Admins manage projects" on public.projects
  for all to authenticated
  using      (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));


-- ───────────── blogs ─────────────
create policy "Public reads published blogs" on public.blogs
  for select to anon, authenticated
  using (is_published = true);

create policy "Admins manage blogs" on public.blogs
  for all to authenticated
  using      (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));


-- ───────────── leads ─────────────
-- Anyone can submit a lead (new, from a known source). Nobody but admins can read them.
create policy "Public can submit a lead" on public.portfolio_leads
  for insert to anon, authenticated
  with check (source in ('contact_form', 'chatbot', 'website') and status = 'new');

create policy "Admins manage leads" on public.portfolio_leads
  for all to authenticated
  using      (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));


-- ───────────── site_settings ─────────────
create policy "Public reads settings" on public.site_settings
  for select to anon, authenticated
  using (true);

create policy "Admins manage settings" on public.site_settings
  for all to authenticated
  using      (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
