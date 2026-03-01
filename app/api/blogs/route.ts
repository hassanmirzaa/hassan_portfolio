import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export type BlogRow = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  category: string | null
  tags: string[] | null
  author: string | null
  published_at: string | null
}

const fallbackBlogs: BlogRow[] = [
  {
    id: "1",
    title: "Creating Digital Products That Help Businesses Grow",
    slug: "creating-digital-products-that-help-businesses-grow",
    content: "Every business today needs more than just an online presence — it needs a digital experience that actually delivers results. While working on different projects, I've seen how the right mobile app can increase customer engagement, improve sales, and streamline daily operations.\n\nMy focus is on building apps that combine clean UI, high performance, and real business value. With the rise of AI, companies can automate tasks, understand customer behavior, and offer personalized experiences that set them apart from competitors.\n\nTechnology isn't just support anymore — it's a profit engine.\n\nAnd my goal is to help businesses unlock that potential by turning ideas into smart, scalable, and high-impact mobile applications.",
    excerpt: "Every business today needs more than just an online presence — it needs a digital experience that actually delivers results.",
    cover_image: "/pov.HEIC",
    category: "Business",
    tags: ["mobile apps", "business growth", "AI", "digital products"],
    author: "Hassan Mirza",
    published_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Why Modern Businesses Need Smart, Scalable Mobile Apps",
    slug: "why-modern-businesses-need-smart-scalable-mobile-apps",
    content: "Working on multiple client projects has shown me one thing clearly:\n\nBusinesses that adopt mobile solutions early grow faster than those that wait.\n\nA mobile app is more than a tool — it's a direct connection to customers, sales insights, and business decisions. When combined with AI, it becomes even more powerful by:\n\n• Understanding customer behavior\n• Predicting trends\n• Automating manual work\n• Cutting down operational costs\n• Offering personalized experiences\n\nThese advantages help companies increase profits, strengthen customer loyalty, and stand out in competitive markets.\n\nMy approach is simple: build mobile apps that perform flawlessly, scale easily, and help businesses turn users into long-term customers.",
    excerpt: "Businesses that adopt mobile solutions early grow faster than those that wait.",
    cover_image: "/my_selfie.heic",
    category: "Business",
    tags: ["mobile apps", "scalability", "AI", "business strategy"],
    author: "Hassan Mirza",
    published_at: "2024-01-01T00:00:00Z",
  },
]

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, content, excerpt, cover_image, category, tags, author, published_at")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })

    if (error || !data || data.length === 0) {
      return NextResponse.json(fallbackBlogs)
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(fallbackBlogs)
  }
}
