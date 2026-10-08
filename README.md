# Hassan Mirza — portfolio

Next.js 16 (App Router), React 19, Tailwind v4, Supabase. Content lives in Supabase and is edited from `/admin`.

## Run locally

```bash
cp .env.example .env.local   # fill in the values
npm install --legacy-peer-deps
npm run dev
```

Without Supabase keys the site still renders from built-in fallback content (the four apps in `lib/projects.ts`).

## Environment variables

| Name | Needed for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | content, leads, admin login |
| `NEXT_PUBLIC_SITE_URL` | canonical URLs, sitemap |
| `GEMINI_API_KEY` | chatbot |
| `RESEND_API_KEY` | lead notification email (replaces the Make.com webhook) |
| `LEAD_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL` | optional overrides for the notification email |

No service-role key is used anywhere. The admin acts as the logged-in user and Row Level Security does the enforcing.

## Database setup (Supabase SQL Editor)

Files are in `supabase/`. Run them in order; each is safe to re-run. Nothing is destructive until `09`.

| Order | File | What it does |
|---|---|---|
| 1 | `01_helpers_and_admins.sql` | updated_at trigger, `admin_users`, `is_admin()` |
| 2 | `02_tables.sql` | creates or upgrades projects, blogs, leads, site settings (never drops data) |
| 3 | `03_security_policies.sql` | replaces all row-level-security policies |
| 4 | `04_storage.sql` | locks the `project-assets` bucket: public read, admin-only write |
| 5 | `05_seed_projects.sql` | the four apps from the redesign |
| 6 | `06_make_me_admin.sql` | create the Auth user first, then this makes it an admin |
| - | `07_verify.sql` | read-only health check, run any time |
| 7 | `08_backup_old_data.sql` | copies old data into hidden backup tables |
| 8 | `09_cleanup_old.sql` | DESTRUCTIVE, all commented out, run by hand after backups |

## Admin

`/admin` — sign in with the Supabase Auth user listed in `admin_users`. Manage projects (with image upload),
blog posts, leads, and site settings (contact email, social links, availability pill).

## Structure

- `app/page.tsx` — home. `app/projects/[slug]` — case studies. `app/blog` — writing.
- `app/admin` — admin panel (`proxy.ts` redirects logged-out visitors; every page re-checks with `requireAdmin()`).
- `app/api/leads` — contact form and chatbot bookings. `app/api/chat` — chatbot (Gemini).
- `lib/projects.ts`, `lib/blogs.ts`, `lib/settings.ts` — data access with fallbacks.
