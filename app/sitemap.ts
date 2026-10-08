import type { MetadataRoute } from "next"
import { getProjects } from "@/lib/projects"
import { getBlogs } from "@/lib/blogs"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogs] = await Promise.all([getProjects(), getBlogs()])
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...blogs.map((b) => ({ url: `${SITE_URL}/blog/${b.slug}`, changeFrequency: "yearly" as const, priority: 0.4 })),
  ]
}
