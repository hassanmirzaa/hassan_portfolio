-- ============================================================
-- 07_verify.sql        READ-ONLY. Run any time to check the setup. Paste the output to me if something looks off.
-- ============================================================

-- 1. Tables and row counts
select 'projects' as tbl, count(*) as rows from public.projects
union all select 'blogs', count(*) from public.blogs
union all select 'portfolio_leads', count(*) from public.portfolio_leads
union all select 'site_settings', count(*) from public.site_settings
union all select 'admin_users', count(*) from public.admin_users;

-- 2. Row Level Security must be ON for all five (rowsecurity = true)
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('projects', 'blogs', 'portfolio_leads', 'site_settings', 'admin_users')
order by tablename;

-- 3. Policies (expect: 2 each on projects/blogs/site_settings, 2 on leads, 1 on admin_users)
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4. Storage policies (expect exactly 4, none that allow "public" to write)
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;

-- 5. Bucket
select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'project-assets';

-- 6. Admins
select u.email from public.admin_users a join auth.users u on u.id = a.user_id;

-- 7. Columns the site code reads (every row should say "ok")
with need(tbl, col) as (values
  ('projects','slug'),('projects','title'),('projects','summary'),('projects','description'),('projects','role'),
  ('projects','problem'),('projects','approach'),('projects','outcome'),('projects','tech_stack'),('projects','accent_color'),
  ('projects','cover_image'),('projects','screens'),('projects','status'),('projects','is_confidential'),('projects','is_published'),
  ('projects','sort_order'),('projects','play_store_url'),('projects','app_store_url'),('projects','github_url'),('projects','live_url'),
  ('projects','demo_video'),('projects','client'),('projects','platforms'),('projects','features'),('projects','highlights'),('projects','year'),('projects','category'),('projects','metrics'),('projects','is_featured'),
  ('blogs','slug'),('blogs','excerpt'),('blogs','content'),('blogs','category'),('blogs','author'),('blogs','tags'),
  ('blogs','published_at'),('blogs','reading_minutes'),('blogs','is_published'),('blogs','sort_order'),
  ('portfolio_leads','name'),('portfolio_leads','email'),('portfolio_leads','message'),('portfolio_leads','project_type'),
  ('portfolio_leads','source'),('portfolio_leads','status'),('portfolio_leads','notes'),('portfolio_leads','call_date'),('portfolio_leads','call_time'),
  ('site_settings','contact_email'),('site_settings','is_available'),('site_settings','available_from'))
select n.tbl, n.col,
       case when c.column_name is null then 'MISSING: run 02_tables.sql' else 'ok' end as status
from need n
left join information_schema.columns c
  on c.table_schema = 'public' and c.table_name = n.tbl and c.column_name = n.col
where c.column_name is null
union all
select 'all', 'checked', 'ok' where not exists (
  select 1 from need n2 left join information_schema.columns c2
    on c2.table_schema = 'public' and c2.table_name = n2.tbl and c2.column_name = n2.col
  where c2.column_name is null);
