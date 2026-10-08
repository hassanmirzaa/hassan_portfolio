import Link from "next/link"
import { formatDate, type Blog } from "@/lib/blogs"

export default function BlogSection({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) return null
  return (
    <section className="s" id="writing" style={{ paddingTop: 0 }} aria-labelledby="writing-title">
      <div className="wrap">
        <div className="head rv">
          <div>
            <div className="eyebrow">Writing</div>
            <h2 className="h2" id="writing-title">
              Notes from <em>the work.</em>
            </h2>
          </div>
          <p>Short pieces on building and shipping apps for real businesses.</p>
        </div>
        <div className="posts">
          {blogs.slice(0, 3).map((b, i) => (
            <Link href={`/blog/${b.slug}`} className={`post rv${i ? ` d${i}` : ""}`} key={b.slug}>
              <span className="cat">
                {b.category} · {formatDate(b.publishedAt)} · {b.readingMinutes} min
              </span>
              <h3>{b.title}</h3>
              <p>{b.excerpt}</p>
              <span className="more">Read →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
