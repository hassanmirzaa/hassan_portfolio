-- ============================================================
-- 01_helpers_and_admins.sql        SAFE to run any time, any number of times
-- Supabase Dashboard > SQL Editor > New query > paste > Run
--
-- Creates: updated_at trigger function, admin_users table, is_admin() helper.
-- Security rules in file 03 read admin_users DIRECTLY (not through is_admin()),
-- so a problem with the function can never break the policies.
-- ============================================================

-- 1. updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Who is allowed to edit the site
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- A logged-in user can see ONLY their own row (needed so policies can check admin status).
-- Nobody can insert, update or delete through the API. You add admins here, in the SQL editor (file 06).
drop policy if exists "Read own admin row" on public.admin_users;
create policy "Read own admin row" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

-- 3. Helper used by the admin app: returns true when the logged-in user is listed above.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Self-check: both rows must show up, and the last query must return "false".
select proname, pronamespace::regnamespace::text as schema
from pg_proc
where proname in ('set_updated_at', 'is_admin')
order by proname;

select public.is_admin() as is_admin_in_sql_editor;   -- false here is correct (no logged-in user)
