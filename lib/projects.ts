import { supabase } from "@/lib/supabase"

export type Project = {
  slug: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  color: string
  image: string
  metrics: string
  rating?: number
  year?: string
  category?: string
  link?: string | null
  playStoreUrl?: string | null
  appStoreUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  demoVideo?: string | null
  screenshots?: string[]
  isFeatured?: boolean
}

// Hardcoded fallback — used if Supabase is unreachable or table doesn't exist yet
const fallbackProjects: Project[] = [
  {
    slug: "waterverse-connect",
    title: "Waterverse Connect",
    description:
      "A comprehensive mobile application for Waterverse customers to manage orders, track deliveries, process payments, view deals, and access customer support.",
    longDescription:
      "A comprehensive mobile application for Waterverse customers to manage orders, track deliveries, process payments, view deals, and access customer support. Features real-time order tracking with Google Maps integration, secure payment processing, push notifications, and a seamless user experience.",
    tech: ["Flutter", "Dart", "Firebase", "Laravel", "REST API", "Google Maps API", "Payment Gateway", "Push Notifications", "Provider", "Cloud Firestore"],
    color: "from-primary/40",
    image: "/waterverse-connect.png",
    metrics: "1K+ Downloads",
    rating: 5.0,
    year: "2024",
    category: "Mobile App",
    link: "https://play.google.com/store/apps/details?id=com.ig.waterverse&pcampaignid=web_share",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ig.waterverse&pcampaignid=web_share",
  },
  {
    slug: "ai-workout-planner",
    title: "AI Workout Planner",
    description:
      "An intelligent fitness application that generates personalized workout plans using AI. Features include progress tracking, exercise demonstrations, and adaptive planning.",
    longDescription:
      "An intelligent fitness application that generates personalized workout plans using AI. Users input their fitness goals, available equipment, and preferences, and the app creates customized workout routines. Features include progress tracking, exercise demonstrations, and adaptive planning based on user feedback.",
    tech: ["Flutter", "Dart", "Supabase", "OpenAI API", "Node.js", "REST API", "Provider", "PostgreSQL", "Edge Functions"],
    color: "from-secondary/40",
    image: "/ai-workout-planner.png",
    metrics: "AI-Powered Solution",
    rating: 5.0,
    year: "2024",
    category: "Mobile App",
    link: null,
    playStoreUrl: null,
  },
  {
    slug: "orange-pos-delivery",
    title: "Orange POS & Delivery System",
    description:
      "A complete Point of Sale and delivery management system. Features real-time GPS tracking, geo-fencing, dynamic discounts, and real-time communication.",
    longDescription:
      "A complete Point of Sale and delivery management system for Orange stores. Enables store owners to manage inventory, process orders, handle payments, track deliveries with real-time GPS, implement geo-fencing for delivery zones, apply dynamic discounts, and manage customer complaints through real-time communication.",
    tech: ["Flutter", "Dart", "Firebase", "Laravel", "Pusher (Real-time)", "SQLite", "REST API", "Google Maps API", "Geo-fencing", "Provider", "MySQL"],
    color: "from-primary/40",
    image: "/orange-pos.jpg",
    metrics: "Enterprise Solution",
    rating: 5.0,
    year: "2024",
    category: "Mobile App",
    link: null,
    playStoreUrl: null,
  },
  {
    slug: "tusai-ai-recipe-generator",
    title: "Tusai - AI Recipe Generator",
    description:
      "A smart recipe application that generates personalized recipes based on available ingredients. Features recipe saving, shopping lists, and dietary preferences.",
    longDescription:
      "A smart recipe application that generates personalized recipes based on available ingredients. Users input what they have in their kitchen, and the AI creates custom recipes with step-by-step instructions. Features include recipe saving, shopping lists, dietary preferences, and monetization through Google Ads.",
    tech: ["Flutter", "Dart", "Firebase", "OpenAI API", "Google AdMob", "Cloud Firestore", "REST API", "Provider", "Firebase Auth"],
    color: "from-secondary/40",
    image: "/tusai.jpg",
    metrics: "AI-Powered App",
    rating: 5.0,
    year: "2024",
    category: "Mobile App",
    link: null,
    playStoreUrl: null,
  },
]

function mapRow(row: Record<string, unknown>): Project {
  return {
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    longDescription: (row.long_description as string) ?? undefined,
    tech: (row.tech_stack as string[]) ?? [],
    color: (row.color as string) ?? "from-primary/40",
    image: (row.cover_image as string) ?? "",
    metrics: (row.metrics as string) ?? "",
    rating: row.rating != null ? Number(row.rating) : undefined,
    year: (row.year as string) ?? undefined,
    category: (row.category as string) ?? undefined,
    link: (row.play_store_url as string) ?? (row.live_url as string) ?? null,
    playStoreUrl: (row.play_store_url as string) ?? null,
    appStoreUrl: (row.app_store_url as string) ?? null,
    githubUrl: (row.github_url as string) ?? null,
    liveUrl: (row.live_url as string) ?? null,
    demoVideo: (row.demo_video as string) ?? null,
    screenshots: (row.screenshots as string[]) ?? [],
    isFeatured: (row.is_featured as boolean) ?? true,
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
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error || !data) return fallbackProjects.find((p) => p.slug === slug)
    return mapRow(data)
  } catch {
    return fallbackProjects.find((p) => p.slug === slug)
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("slug")
      .eq("is_published", true)

    if (error || !data || data.length === 0) return fallbackProjects.map((p) => p.slug)
    return data.map((r) => r.slug as string)
  } catch {
    return fallbackProjects.map((p) => p.slug)
  }
}

// Synchronous access for client components that can't await
export { fallbackProjects as projects }
