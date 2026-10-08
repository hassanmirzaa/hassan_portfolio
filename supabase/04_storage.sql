-- ============================================================
-- 04_storage.sql        SAFE. Run AFTER 01.
--
-- Your old policy ("Allow service role uploads" ... FOR ALL USING (bucket_id = 'project-assets'))
-- applied to EVERYONE, including logged-out visitors: anyone could upload, overwrite or delete files.
-- This replaces it: everyone can READ, only admins can write.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

-- Limits: 10 MB per file, images only (plus mp4 for demo clips).
update storage.buckets
set public = true,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'video/mp4']
where id = 'project-assets';

-- Drop every policy that mentions this bucket, then create the right ones.
do $$
declare r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (policyname in ('Allow service role uploads',
                          'Public read project assets',
                          'Admins insert project assets',
                          'Admins update project assets',
                          'Admins delete project assets')
           or coalesce(qual, '') ilike '%project-assets%'
           or coalesce(with_check, '') ilike '%project-assets%')
  loop
    execute format('drop policy %I on storage.objects', r.policyname);
  end loop;
end $$;

create policy "Public read project assets" on storage.objects
  for select to public
  using (bucket_id = 'project-assets');

create policy "Admins insert project assets" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-assets'
              and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create policy "Admins update project assets" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-assets'
         and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create policy "Admins delete project assets" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-assets'
         and exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
