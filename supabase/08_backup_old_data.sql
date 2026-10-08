-- ============================================================
-- 08_backup_old_data.sql        SAFE. Run BEFORE file 09 (the destructive one).
--
-- Copies projects, blogs and leads into backup tables inside your database.
-- The backups have Row Level Security on with no policies, so the website/API cannot see them.
-- Also export CSVs from the Table Editor if you want a copy outside Supabase.
-- Running it twice does not overwrite an existing backup.
-- ============================================================

create table if not exists public._bak_projects_20261008        as table public.projects;
create table if not exists public._bak_blogs_20261008           as table public.blogs;
create table if not exists public._bak_portfolio_leads_20261008 as table public.portfolio_leads;

alter table public._bak_projects_20261008        enable row level security;
alter table public._bak_blogs_20261008           enable row level security;
alter table public._bak_portfolio_leads_20261008 enable row level security;

select '_bak_projects_20261008' as backup, count(*) from public._bak_projects_20261008
union all select '_bak_blogs_20261008', count(*) from public._bak_blogs_20261008
union all select '_bak_portfolio_leads_20261008', count(*) from public._bak_portfolio_leads_20261008;
