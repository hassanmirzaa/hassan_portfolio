-- ============================================================
-- 06_make_me_admin.sql        SAFE. Run AFTER 01.
--
-- STEP 1 (once): Supabase Dashboard > Authentication > Users > "Add user" > Create new user
--                email: hassanmirza0801@gmail.com, choose a strong password, tick "Auto Confirm User".
-- STEP 2: run this file.  It must report 1 row.
--
-- To add another admin later, change the email below and run again.
-- To remove an admin:  delete from public.admin_users where user_id = (select id from auth.users where email = '...');
-- ============================================================

insert into public.admin_users (user_id)
select id from auth.users where email = 'hassanmirza0801@gmail.com'
on conflict do nothing;

-- Should list your user. Empty result = STEP 1 was not done (no such auth user).
select u.email, a.created_at as admin_since
from public.admin_users a
join auth.users u on u.id = a.user_id;
