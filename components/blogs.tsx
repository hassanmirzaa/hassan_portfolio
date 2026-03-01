"use client"

import { useEffect, useState, useRef } from "react"

type Blog = {
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

const fallbackBlogs: Blog[] = [
  {
    id: "1",
    title: "Creating Digital Products That Help Businesses Grow",
    slug: "creating-digital-products",
    content: "Every business today needs more than just an online presence — it needs a digital experience that actually delivers results. While working on different projects, I've seen how the right mobile app can increase customer engagement, improve sales, and streamline daily operations.\n\nMy focus is on building apps that combine clean UI, high performance, and real business value. With the rise of AI, companies can automate tasks, understand customer behavior, and offer personalized experiences that set them apart from competitors.\n\nTechnology isn't just support anymore — it's a profit engine.\n\nAnd my goal is to help businesses unlock that potential by turning ideas into smart, scalable, and high-impact mobile applications.",
    excerpt: null,
    cover_image: "/pov.HEIC",
    category: "Business",
    tags: null,
    author: "Hassan Mirza",
    published_at: null,
  },
  {
    id: "2",
    title: "Why Modern Businesses Need Smart, Scalable Mobile Apps",
    slug: "why-modern-businesses-need-apps",
    content: "Working on multiple client projects has shown me one thing clearly:\n\nBusinesses that adopt mobile solutions early grow faster than those that wait.\n\nA mobile app is more than a tool — it's a direct connection to customers, sales insights, and business decisions. When combined with AI, it becomes even more powerful by:\n\n• Understanding customer behavior\n• Predicting trends\n• Automating manual work\n• Cutting down operational costs\n• Offering personalized experiences\n\nThese advantages help companies increase profits, strengthen customer loyalty, and stand out in competitive markets.\n\nMy approach is simple: build mobile apps that perform flawlessly, scale easily, and help businesses turn users into long-term customers.",
    excerpt: null,
    cover_image: "/my_selfie.heic",
    category: "Business",
    tags: null,
    author: "Hassan Mirza",
    published_at: null,
  },
]

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>(fallbackBlogs)
  const [showAll, setShowAll] = useState(false)
  const [visibleBlogs, setVisibleBlogs] = useState<boolean[]>([])
  const observersRef = useRef<IntersectionObserver[]>([])

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setBlogs(data)
      })
      .catch(() => {})
  }, [])

  const displayedBlogs = showAll ? blogs : blogs.slice(0, 2)

  useEffect(() => {
    observersRef.current.forEach((o) => o.disconnect())
    observersRef.current = []

    displayedBlogs.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleBlogs((prev) => {
              const next = [...prev]
              next[idx] = true
              return next
            })
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      )

      const el = document.getElementById(`blog-${idx}`)
      if (el) {
        observer.observe(el)
        observersRef.current.push(observer)
      }
    })

    return () => {
      observersRef.current.forEach((o) => o.disconnect())
    }
  }, [displayedBlogs])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return null
    }
  }

  return (
    <section id="blogs" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">
            Blogs
          </span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto">
          Insights on mobile app development, business growth, and technology trends.
        </p>

        <div className="space-y-12 md:space-y-16">
          {displayedBlogs.map((blog, idx) => (
            <article
              key={blog.id}
              id={`blog-${idx}`}
              className={`glass-effect card-hover rounded-lg border border-primary/30 overflow-hidden scroll-fade-in ${
                visibleBlogs[idx] ? "visible" : ""
              } ${idx % 2 === 0 ? "scroll-stagger-1" : "scroll-stagger-2"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-br from-primary/20 to-secondary/20">
                  {blog.cover_image ? (
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-foreground/30 text-lg">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-foreground/50">
                    {blog.author && <span>{blog.author}</span>}
                    {blog.published_at && (
                      <>
                        <span>•</span>
                        <span>{formatDate(blog.published_at)}</span>
                      </>
                    )}
                    {blog.category && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary/80 rounded-full text-xs border border-primary/30">
                          {blog.category}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    {blog.title}
                  </h3>

                  <div className="text-foreground/80 leading-relaxed">
                    {blog.content.split("\n").map((line, lineIdx) => {
                      if (line.trim().startsWith("•")) {
                        return (
                          <div key={lineIdx} className="ml-4 mb-2">
                            {line}
                          </div>
                        )
                      }
                      if (line.trim() === "") {
                        return <div key={lineIdx} className="mb-4" />
                      }
                      return (
                        <p key={lineIdx} className="mb-4 last:mb-0">
                          {line}
                        </p>
                      )
                    })}
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/10">
                      {blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-secondary/10 text-secondary/80 rounded-full text-xs border border-secondary/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {blogs.length > 2 && !showAll && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="btn-interactive inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold"
            >
              See More Blogs
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
