import { supabase } from "@/lib/supabase"

export type Blog = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string | null
  readingMinutes: number
}

const fallbackBlogs: Blog[] = [
  {
    slug: "creating-digital-products-that-help-businesses-grow",
    title: "Creating digital products that help businesses grow",
    excerpt: "Every business today needs more than an online presence. It needs a digital experience that delivers results.",
    content:
      "Every business today needs more than just an online presence. It needs a digital experience that actually delivers results. Working on different projects, I've seen how the right mobile app can increase customer engagement, improve sales, and streamline daily operations.\n\nMy focus is on apps that combine clean UI, high performance, and real business value.\n\nTechnology isn't just support anymore. It's a profit engine, and my goal is to help businesses unlock that by turning ideas into scalable mobile applications.",
    category: "Business",
    author: "Hassan Mirza",
    publishedAt: "2024-01-01T00:00:00Z",
    readingMinutes: 1,
  },
]

function words(text: string) {
  return text.trim().split(/\s+/).length
}

function mapRow(r: Record<string, unknown>): Blog {
  const content = (r.content as string) ?? ""
  const stored = Number(r.reading_minutes)
  return {
    slug: r.slug as string,
    title: r.title as string,
    excerpt: (r.excerpt as string) || content.slice(0, 140).trimEnd() + "…",
    content,
    category: (r.category as string) || "General",
    author: (r.author as string) || "Hassan Mirza",
    publishedAt: (r.published_at as string) ?? null,
    readingMinutes: stored > 0 ? stored : Math.max(1, Math.round(words(content) / 200)),
  }
}

export async function getBlogs(limit?: number): Promise<Blog[]> {
  try {
    let q = supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error || !data) return fallbackBlogs.slice(0, limit)
    return data.map(mapRow)
  } catch {
    return fallbackBlogs.slice(0, limit)
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  return (await getBlogs()).find((b) => b.slug === slug)
}

export function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}
