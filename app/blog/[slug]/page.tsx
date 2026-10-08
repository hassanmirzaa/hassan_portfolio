import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import Contact from "@/components/contact"
import { getBlogBySlug, getBlogs, formatDate } from "@/lib/blogs"
import { getSettings } from "@/lib/settings"
import { SITE_URL } from "@/lib/site"

export const revalidate = 60
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getBlogs()).map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const b = await getBlogBySlug(slug)
  if (!b) return { title: "Post not found" }
  return {
    title: b.title,
    description: b.excerpt,
    alternates: { canonical: `/blog/${b.slug}` },
    openGraph: { type: "article", title: b.title, description: b.excerpt, url: `${SITE_URL}/blog/${b.slug}` },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const [b, settings] = await Promise.all([getBlogBySlug(slug), getSettings()])
  if (!b) notFound()
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: b.title,
    author: { "@type": "Person", name: b.author },
    datePublished: b.publishedAt ?? undefined,
    url: `${SITE_URL}/blog/${b.slug}`,
  }
  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main">
        <article className="wrap page-top">
          <Link className="back" href="/blog">
            ← All writing
          </Link>
          <p className="eyebrow">
            {b.category} · {formatDate(b.publishedAt)} · {b.readingMinutes} min read
          </p>
          <h1 className="case-title" style={{ maxWidth: "18ch", fontSize: "clamp(40px,6.5vw,96px)" }}>
            {b.title}
          </h1>
          <div className="article" style={{ marginTop: 50 }}>
            {b.content.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
        <Contact settings={settings} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </main>
    </>
  )
}
