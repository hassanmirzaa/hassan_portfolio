import type { Metadata } from "next"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import Contact from "@/components/contact"
import { getBlogs, formatDate } from "@/lib/blogs"
import { getSettings } from "@/lib/settings"

export const revalidate = 60
export const metadata: Metadata = { title: "Writing", description: "Notes on building and shipping mobile apps.", alternates: { canonical: "/blog" } }

export default async function BlogIndex() {
  const [blogs, settings] = await Promise.all([getBlogs(), getSettings()])
  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main">
        <div className="wrap page-top">
          <Link className="back" href="/">
            ← Home
          </Link>
          <h1 className="case-title">Writing</h1>
          <div className="posts" style={{ marginTop: 50 }}>
            {blogs.map((b) => (
              <Link href={`/blog/${b.slug}`} className="post" key={b.slug}>
                <span className="cat">
                  {b.category} · {formatDate(b.publishedAt)} · {b.readingMinutes} min
                </span>
                <h2 style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 24, lineHeight: 1.08, letterSpacing: "-0.035em" }}>{b.title}</h2>
                <p>{b.excerpt}</p>
                <span className="more">Read →</span>
              </Link>
            ))}
          </div>
          {blogs.length === 0 && <p>Nothing here yet.</p>}
        </div>
        <Contact settings={settings} />
      </main>
    </>
  )
}
