import { supabase } from "@/lib/supabase"

export type Screen = { url: string; caption?: string; text?: string; alt?: string }
export type Feature = { title: string; text?: string }
export type Highlight = { value: string; label: string }
export type Platform = "ios" | "android" | "web"

export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  client?: string
  role?: string
  platforms: Platform[]
  features: Feature[]
  highlights: Highlight[]
  problem?: string
  approach?: string
  outcome?: string
  tech: string[]
  accent: string
  image: string
  screens: Screen[]
  metrics?: string
  year?: string
  category?: string
  status: "live" | "in_development" | "archived"
  isConfidential: boolean
  playStoreUrl?: string | null
  appStoreUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  demoVideo?: string | null
}

// Local screenshots shipped with the site. Used when the database has no cover for a slug.
const LOCAL_IMAGES: Record<string, string> = {
  "waterverse-connect": "/projects/waterverse-connect.jpg",
  "waterverse-command": "/projects/waterverse-command.jpg",
  "innova-pm": "/projects/innova-pm.jpg",
  "ismail-hr-app": "/projects/ismail-hr-app.jpg",
}

// Used if Supabase is unreachable or the tables are empty. Mirrors supabase/05 and 10.
export const fallbackProjects: Project[] = [
  {
    slug: "waterverse-connect",
    title: "Waterverse Connect",
    summary: "Orders, deliveries, addresses and advance payments for customers",
    description:
      "The customer app for Waterverse. Customers place and track orders, manage delivery addresses, check their account summary, pay in advance and reach support from one place.",
    client: "Waterverse",
    platforms: ["android"],
    features: [
      { title: "Delivery calendar", text: "Past, delivered and upcoming deliveries as dated cards, so customers always know what is on the way." },
      { title: "Orders", text: "Place and review refill orders from one list." },
      { title: "Delivery addresses", text: "Save and manage the places water gets delivered to." },
      { title: "Account summary", text: "A clear statement of what the customer has ordered and paid." },
      { title: "Pay in advance", text: "Prepay for refills, with promotional banners that show the saving." },
      { title: "Refer a friend", text: "Built-in referral flow." },
      { title: "Support", text: "A floating support button available on every screen." },
    ],
    highlights: [],
    tech: ["Flutter", "Dart", "Laravel", "Firebase"],
    accent: "#2556B2",
    image: LOCAL_IMAGES["waterverse-connect"],
    screens: [
      {
        url: LOCAL_IMAGES["waterverse-connect"],
        caption: "Home",
        text: "Greeting with the delivery address, promotional banner, the delivery calendar and one-tap access to orders, addresses, account, advance payments and referrals.",
      },
    ],
    year: "2024",
    category: "Mobile app",
    status: "live",
    isConfidential: true,
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ig.waterverse&pcampaignid=web_share",
  },
  {
    slug: "waterverse-command",
    title: "Waterverse Command",
    summary: "Daily sales and service performance for leadership",
    description:
      "An executive dashboard for Waterverse. It shows bottles sold, scheduled and visited stops, productive visits and drop size for the day, compared with the same weekday last week, and filters by customer type.",
    client: "Waterverse",
    platforms: [],
    features: [
      { title: "Daily performance", text: "The headline number for the day: bottles sold, with the actual date shown." },
      { title: "Scheduled, visited, productive", text: "How many stops were planned, how many were visited, and how many ended in a sale, with completion rates." },
      { title: "Drop size", text: "Average bottles per productive visit." },
      { title: "Week-on-week comparison", text: "The day compared with the same weekday last week, so trends are visible immediately." },
      { title: "Filters", text: "Date range, area and customer type (commercial, residential, retailer)." },
      { title: "Five sections", text: "Overview, Sales, Routes, Customers and More from a persistent bottom bar." },
    ],
    highlights: [],
    tech: ["Flutter", "Dart"],
    accent: "#0A1530",
    image: LOCAL_IMAGES["waterverse-command"],
    screens: [
      {
        url: LOCAL_IMAGES["waterverse-command"],
        caption: "Executive brief",
        text: "A single dark, high-contrast screen that answers how yesterday went: sales, visits, productivity and the comparison with last week.",
      },
    ],
    year: "2026",
    category: "Mobile app",
    status: "live",
    isConfidential: true,
  },
  {
    slug: "innova-pm",
    title: "Innova PM",
    summary: "Projects, tasks and discussions across departments",
    description:
      "A project management app for Ismail Industries. It tracks projects and tasks by department and status, shows overdue and in-progress work at a glance, and keeps discussions next to the work.",
    client: "Ismail Industries",
    platforms: ["android"],
    features: [
      { title: "Dashboard counters", text: "Total, completed, in-progress and overdue projects as colour-coded tiles." },
      { title: "Project status chart", text: "A donut chart with completed and in-progress percentages and the average progress." },
      { title: "Department filters", text: "Switch between all departments, IT, Management, Product and more." },
      { title: "Tasks by department", text: "See where the work is sitting across teams." },
      { title: "Projects and My Tasks", text: "A project list plus a personal task list for each person." },
      { title: "Discussions", text: "Conversations live next to the work, not in a separate chat tool." },
      { title: "Notifications", text: "Bell with updates, and a profile avatar for the signed-in user." },
    ],
    highlights: [],
    tech: ["Flutter", "Dart"],
    accent: "#151D24",
    image: LOCAL_IMAGES["innova-pm"],
    screens: [
      {
        url: LOCAL_IMAGES["innova-pm"],
        caption: "Dashboard",
        text: "Overview of every project: counters, a status chart, average progress and tasks per department.",
      },
    ],
    year: "2026",
    category: "Mobile app",
    status: "live",
    isConfidential: true,
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.iil.pmtool",
  },
  {
    slug: "ismail-hr-app",
    title: "Ismail HR App",
    summary: "Attendance, leaves, objectives and loans for employees",
    description:
      "The employee self-service app for Ismail Industries. Staff check in and out, follow weekly working hours, request leaves and loans, set objectives and share ideas.",
    client: "Ismail Industries",
    platforms: [],
    features: [
      { title: "Digital employee card", text: "Employee ID, name and designation with a QR code and a link to the full profile." },
      { title: "Weekly working hours", text: "Hours worked against the 40-hour requirement, with a progress ring and a bar for each weekday." },
      { title: "Check-in and check-out", text: "Today's check-in and check-out times at a glance." },
      { title: "Attendance", text: "Track and manage attendance." },
      { title: "Leaves", text: "Request and manage leave." },
      { title: "Objectives", text: "Set and achieve personal objectives." },
      { title: "Ideas", text: "Share and develop ideas with the company." },
      { title: "Loans", text: "Apply for and track loans." },
      { title: "Surveys and more", text: "Further modules, plus a light and dark mode switch." },
    ],
    highlights: [],
    tech: ["Flutter", "Dart"],
    accent: "#3571B5",
    image: LOCAL_IMAGES["ismail-hr-app"],
    screens: [
      {
        url: LOCAL_IMAGES["ismail-hr-app"],
        caption: "Home",
        text: "The employee's day on one screen: ID card, weekly hours, today's check-in and the shortcuts to every HR module.",
      },
    ],
    year: "2025",
    category: "Mobile app",
    status: "live",
    isConfidential: true,
  },
]

const ACCENT_RE = /^#[0-9a-fA-F]{6}$/

function firstSentence(text: string, max = 110) {
  const s = text.split(/(?<=[.!?])\s/)[0] ?? text
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s
}

function str(v: unknown) {
  return typeof v === "string" && v.trim() ? v.trim() : undefined
}

function arr<T>(v: unknown, ok: (x: unknown) => x is T): T[] {
  return Array.isArray(v) ? v.filter(ok) : []
}

const isFeature = (x: unknown): x is Feature => !!x && typeof (x as Feature).title === "string" && (x as Feature).title.trim() !== ""
const isHighlight = (x: unknown): x is Highlight =>
  !!x && typeof (x as Highlight).value === "string" && typeof (x as Highlight).label === "string"
const isScreen = (x: unknown): x is Screen => !!x && typeof (x as Screen).url === "string" && (x as Screen).url !== ""
const isPlatform = (x: unknown): x is Platform => x === "ios" || x === "android" || x === "web"

function mapRow(row: Record<string, unknown>): Project {
  const slug = row.slug as string
  const description = (str(row.description) ?? str(row.long_description) ?? "") as string
  const accent = ACCENT_RE.test(String(row.accent_color ?? "")) ? (row.accent_color as string) : "#17403A"
  const screens = arr(row.screens, isScreen)
  const legacyShots = Array.isArray(row.screenshots) ? (row.screenshots as string[]).map((url) => ({ url })) : []
  const image = LOCAL_IMAGES[slug] ?? str(row.cover_image) ?? screens[0]?.url ?? ""
  return {
    slug,
    title: row.title as string,
    summary: str(row.summary) ?? firstSentence(description),
    description,
    client: str(row.client),
    role: str(row.role),
    platforms: arr(row.platforms, isPlatform),
    features: arr(row.features, isFeature),
    highlights: arr(row.highlights, isHighlight),
    problem: str(row.problem),
    approach: str(row.approach),
    outcome: str(row.outcome),
    tech: (row.tech_stack as string[]) ?? [],
    accent,
    image,
    screens: screens.length ? screens : legacyShots.length ? legacyShots : image ? [{ url: image }] : [],
    metrics: str(row.metrics),
    year: str(row.year),
    category: str(row.category),
    status: (["live", "in_development", "archived"].includes(row.status as string) ? row.status : "live") as Project["status"],
    isConfidential: Boolean(row.is_confidential),
    playStoreUrl: str(row.play_store_url) ?? null,
    appStoreUrl: str(row.app_store_url) ?? null,
    githubUrl: str(row.github_url) ?? null,
    liveUrl: str(row.live_url) ?? null,
    demoVideo: str(row.demo_video) ?? null,
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
    if (error || !data || data.length === 0) return fallbackProjects
    return data.map(mapRow)
  } catch {
    return fallbackProjects
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects()
  return all.find((p) => p.slug === slug)
}

export const PLATFORM_LABEL: Record<Platform, string> = { ios: "iOS", android: "Android", web: "Web" }
