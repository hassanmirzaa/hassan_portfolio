-- ============================================================
-- 05_seed_projects.sql        SAFE: adds the four apps from the redesign.
-- Run AFTER 02. If a slug already exists, ONLY the new fields are filled in
-- (summary, accent colour, confidential flag, order). Your existing text is kept.
--
-- The text for NEW rows is drafted from the app screenshots. Review and edit it in /admin.
-- Cover images are not set here: the site ships local screenshots for these four slugs.
-- ============================================================

insert into public.projects
  (slug, title, summary, description, category, tech_stack, accent_color, year, status,
   is_confidential, is_featured, is_published, sort_order, play_store_url)
values
  ('waterverse-connect', 'Waterverse Connect',
   'Orders, deliveries, addresses and advance payments for customers',
   'The customer app for Waterverse. Customers place and track orders, manage delivery addresses, check their account summary, pay in advance and reach support from one place.',
   'Mobile App', array['Flutter', 'Dart', 'Laravel', 'Firebase'],
   '#2556B2', '2024', 'live', true, true, true, 1,
   'https://play.google.com/store/apps/details?id=com.ig.waterverse&pcampaignid=web_share'),

  ('waterverse-command', 'Waterverse Command',
   'Daily sales and service performance for leadership',
   'An executive dashboard for Waterverse. It shows bottles sold, scheduled and visited stops, productive visits and drop size for the day, compared with the same weekday last week, and filters by customer type.',
   'Mobile App', array['Flutter', 'Dart'],
   '#0A1530', '2026', 'live', true, true, true, 2,
   null),

  ('innova-pm', 'Innova PM',
   'Projects, tasks and discussions across departments',
   'A project management app for Ismail Industries. It tracks projects and tasks by department and status, shows overdue and in-progress work at a glance, and keeps discussions next to the work.',
   'Mobile App', array['Flutter', 'Dart'],
   '#151D24', '2026', 'live', true, true, true, 3,
   'https://play.google.com/store/apps/details?id=com.iil.pmtool'),

  ('ismail-hr-app', 'Ismail HR App',
   'Attendance, leaves, objectives and loans for employees',
   'The employee self-service app for Ismail Industries. Staff check in and out, follow weekly working hours, request leaves and loans, set objectives and share ideas.',
   'Mobile App', array['Flutter', 'Dart'],
   '#3571B5', '2025', 'live', true, true, true, 4,
   null)
on conflict (slug) do update set
  summary         = excluded.summary,
  accent_color    = excluded.accent_color,
  is_confidential = excluded.is_confidential,
  sort_order      = excluded.sort_order;

-- Result: the four apps, in order.
select sort_order, slug, title, is_published from public.projects order by sort_order, created_at;
