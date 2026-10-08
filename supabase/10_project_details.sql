-- ============================================================
-- 10_project_details.sql        SAFE: adds columns, fills draft details for the four apps.
-- Run AFTER 02. Re-runnable. Does not delete anything.
--
-- New fields (all optional, empty = hidden on the site):
--   client      who the app was built for
--   platforms   {ios,android,web}
--   features    [{"title":"...","text":"..."}]       what the app does
--   highlights  [{"value":"1K+","label":"Downloads"}] REAL numbers only
--   screens     [{"url":"...","caption":"Title","text":"Explanation"}]  (existing column, now with text)
--
-- The features below are drafted from what is visible in your screenshots.
-- Review and edit them in /admin. Nothing here claims a number.
-- ============================================================

alter table public.projects
  add column if not exists client     text,
  add column if not exists platforms  text[] not null default '{}',
  add column if not exists features   jsonb  not null default '[]'::jsonb,
  add column if not exists highlights jsonb  not null default '[]'::jsonb;

do $$ begin
  alter table public.projects add constraint projects_platforms_check
    check (platforms <@ array['ios', 'android', 'web']);
exception when duplicate_object then null; end $$;

-- ───────────── Waterverse Connect ─────────────
update public.projects set
  client = 'Waterverse',
  platforms = case when platforms = '{}' then array['android'] else platforms end,
  features = '[
    {"title":"Delivery calendar","text":"Past, delivered and upcoming deliveries as dated cards, so customers always know what is on the way."},
    {"title":"Orders","text":"Place and review refill orders from one list."},
    {"title":"Delivery addresses","text":"Save and manage the places water gets delivered to."},
    {"title":"Account summary","text":"A clear statement of what the customer has ordered and paid."},
    {"title":"Pay in advance","text":"Prepay for refills, with promotional banners that show the saving."},
    {"title":"Refer a friend","text":"Built-in referral flow."},
    {"title":"Support","text":"A floating support button available on every screen."}
  ]'::jsonb,
  screens = case when jsonb_array_length(screens) = 0 then
    '[{"url":"/projects/waterverse-connect.jpg","caption":"Home","text":"Greeting with the delivery address, promotional banner, the delivery calendar and one-tap access to orders, addresses, account, advance payments and referrals."}]'::jsonb
    else screens end
where slug = 'waterverse-connect';

-- ───────────── Waterverse Command ─────────────
update public.projects set
  client = 'Waterverse',
  features = '[
    {"title":"Daily performance","text":"The headline number for the day: bottles sold, with the actual date shown."},
    {"title":"Scheduled, visited, productive","text":"How many stops were planned, how many were visited, and how many ended in a sale, with completion rates."},
    {"title":"Drop size","text":"Average bottles per productive visit."},
    {"title":"Week-on-week comparison","text":"The day compared with the same weekday last week, so trends are visible immediately."},
    {"title":"Filters","text":"Date range, area and customer type (commercial, residential, retailer)."},
    {"title":"Five sections","text":"Overview, Sales, Routes, Customers and More from a persistent bottom bar."}
  ]'::jsonb,
  screens = case when jsonb_array_length(screens) = 0 then
    '[{"url":"/projects/waterverse-command.jpg","caption":"Executive brief","text":"A single dark, high-contrast screen that answers how yesterday went: sales, visits, productivity and the comparison with last week."}]'::jsonb
    else screens end
where slug = 'waterverse-command';

-- ───────────── Innova PM ─────────────
update public.projects set
  client = 'Ismail Industries',
  platforms = case when platforms = '{}' then array['android'] else platforms end,
  features = '[
    {"title":"Dashboard counters","text":"Total, completed, in-progress and overdue projects as colour-coded tiles."},
    {"title":"Project status chart","text":"A donut chart with completed and in-progress percentages and the average progress."},
    {"title":"Department filters","text":"Switch between all departments, IT, Management, Product and more."},
    {"title":"Tasks by department","text":"See where the work is sitting across teams."},
    {"title":"Projects and My Tasks","text":"A project list plus a personal task list for each person."},
    {"title":"Discussions","text":"Conversations live next to the work, not in a separate chat tool."},
    {"title":"Notifications","text":"Bell with updates, and a profile avatar for the signed-in user."}
  ]'::jsonb,
  screens = case when jsonb_array_length(screens) = 0 then
    '[{"url":"/projects/innova-pm.jpg","caption":"Dashboard","text":"Overview of every project: counters, a status chart, average progress and tasks per department."}]'::jsonb
    else screens end
where slug = 'innova-pm';

-- ───────────── Ismail HR App ─────────────
update public.projects set
  client = 'Ismail Industries',
  features = '[
    {"title":"Digital employee card","text":"Employee ID, name and designation with a QR code and a link to the full profile."},
    {"title":"Weekly working hours","text":"Hours worked against the 40-hour requirement, with a progress ring and a bar for each weekday."},
    {"title":"Check-in and check-out","text":"Today''s check-in and check-out times at a glance."},
    {"title":"Attendance","text":"Track and manage attendance."},
    {"title":"Leaves","text":"Request and manage leave."},
    {"title":"Objectives","text":"Set and achieve personal objectives."},
    {"title":"Ideas","text":"Share and develop ideas with the company."},
    {"title":"Loans","text":"Apply for and track loans."},
    {"title":"Surveys and more","text":"Further modules, plus a light and dark mode switch."}
  ]'::jsonb,
  screens = case when jsonb_array_length(screens) = 0 then
    '[{"url":"/projects/ismail-hr-app.jpg","caption":"Home","text":"The employee''s day on one screen: ID card, weekly hours, today''s check-in and the shortcuts to every HR module."}]'::jsonb
    else screens end
where slug = 'ismail-hr-app';

select slug, client, platforms, jsonb_array_length(features) as features, jsonb_array_length(screens) as screens
from public.projects where slug in ('waterverse-connect','waterverse-command','innova-pm','ismail-hr-app') order by sort_order;
