-- ============================================================
-- 09_cleanup_old.sql        DESTRUCTIVE. Every statement is commented out.
--
-- Run ONLY when all of these are true:
--   [ ] 01, 02, 03, 04, 05, 06 ran fine and 07_verify.sql looks right
--   [ ] 08_backup_old_data.sql ran (and you exported CSVs if you want)
--   [ ] the redesigned site works against the database (locally or deployed)
--
-- Then uncomment ONE block at a time, select just that block, and run it.
-- ============================================================


-- A. Remove the old projects that are not in the redesign.
--    Look first:  select slug, title from public.projects order by sort_order;
-- delete from public.projects
-- where slug in (
--   'barkah-wallet',
--   'ai-fitness-planner',
--   'ai-workout-planner',
--   'orange-pos-delivery',
--   'tusai-ai-recipe-generator'
-- );


-- B. Merge the old long text into description, then drop legacy columns.
--    (The site now shows one text. long_description used to take priority.)
-- update public.projects set description = long_description where long_description is not null and long_description <> '';
-- alter table public.projects drop column if exists long_description;
-- alter table public.projects drop column if exists rating;        -- the fake-looking 5.0 ratings
-- alter table public.projects drop column if exists color;         -- old Tailwind gradient class
-- alter table public.projects drop column if exists screenshots;   -- replaced by "screens" (with captions)


-- C. Remove the test blog post. (Blogs stay otherwise.)
-- delete from public.blogs where title ilike '%testi blog%';


-- D. Make.com webhook trigger. Run only after the site emails you new leads itself (Resend)
--    and one test lead reached your inbox. Also rotate the webhook URL in Make.com:
--    it was pasted into a chat.
-- drop trigger  if exists on_new_lead_inserted on public.portfolio_leads;
-- drop function if exists public.notify_make_on_new_lead();


-- E. Test leads. Look first, then delete only what you checked.
--    select id, name, email, source, created_at from public.portfolio_leads order by created_at desc;
-- delete from public.portfolio_leads where id in (/* ids you checked */);


-- F. Old uploaded images: Dashboard > Storage > project-assets > covers/
--    Delete the files of the projects removed in block A.


-- G. Backups: drop them only after you are sure nothing was lost (weeks later).
-- drop table if exists public._bak_projects_20261008;
-- drop table if exists public._bak_blogs_20261008;
-- drop table if exists public._bak_portfolio_leads_20261008;
