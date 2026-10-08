import { supabase } from "@/lib/supabase"

export type Screen = { url: string; caption?: string; alt?: string }

export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  role?: string
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

// Used if Supabase is unreachable or the tables are empty.
export const fallbackProjects: Project[] = [
  {
    slug: "waterverse-connect",
    title: "Waterverse Connect",
    summary: "Orders, deliveries, addresses and advance payments for customers",
    description:
      "The customer app for Waterverse. Customers place and track orders, manage delivery addresses, check their account summary, pay in advance and reach support from one place.",
    tech: ["Flutter", "Dart", "Laravel", "Firebase"],
    accent: "#2556B2",
    image: LOCAL_IMAGES["waterverse-connect"],
    screens: [],
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
    tech: ["Flutter", "Dart"],
    accent: "#0A1530",
    image: LOCAL_IMAGES["waterverse-command"],
    screens: [],
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
    tech: ["Flutter", "Dart"],
    accent: "#151D24",
    image: LOCAL_IMAGES["innova-pm"],
    screens: [],
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
    tech: ["Flutter", "Dart"],
    accent: "#3571B5",
    image: LOCAL_IMAGES["ismail-hr-app"],
    screens: [],
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

function mapRow(row: Record<string, unknown>): Project {
  const slug = row.slug as string
  const description = (str(row.description) ?? str(row.long_description) ?? "") as string
  const accent = ACCENT_RE.test(String(row.accent_color ?? "")) ? (row.accent_color as string) : "#17403A"
  const rawScreens = Array.isArray(row.screens) ? (row.screens as Screen[]) : []
  const legacyShots = Array.isArray(row.screenshots) ? (row.screenshots as string[]).map((url) => ({ url })) : []
  return {
    slug,
    title: row.title as string,
    summary: str(row.summary) ?? firstSentence(description),
    description,
    role: str(row.role),
    problem: str(row.problem),
    approach: str(row.approach),
    outcome: str(row.outcome),
    tech: (row.tech_stack as string[]) ?? [],
    accent,
    image: LOCAL_IMAGES[slug] ?? str(row.cover_image) ?? "",
    screens: rawScreens.length ? rawScreens : legacyShots,
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
