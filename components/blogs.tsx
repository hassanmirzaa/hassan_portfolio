"use client"

import { useEffect, useState } from "react"

export default function Blogs() {
  const [visibleBlogs, setVisibleBlogs] = useState<boolean[]>([])

  const blogs = [
    {
      id: 1,
      image: "/pov.HEIC",
      title: "Creating Digital Products That Help Businesses Grow",
      content: "Every business today needs more than just an online presence — it needs a digital experience that actually delivers results. While working on different projects, I've seen how the right mobile app can increase customer engagement, improve sales, and streamline daily operations.\n\nMy focus is on building apps that combine clean UI, high performance, and real business value. With the rise of AI, companies can automate tasks, understand customer behavior, and offer personalized experiences that set them apart from competitors.\n\nTechnology isn't just support anymore — it's a profit engine.\n\nAnd my goal is to help businesses unlock that potential by turning ideas into smart, scalable, and high-impact mobile applications.",
    },
    {
      id: 2,
      image: "/my_selfie.heic",
      title: "Why Modern Businesses Need Smart, Scalable Mobile Apps",
      content: "Working on multiple client projects has shown me one thing clearly:\n\nBusinesses that adopt mobile solutions early grow faster than those that wait.\n\nA mobile app is more than a tool — it's a direct connection to customers, sales insights, and business decisions. When combined with AI, it becomes even more powerful by:\n\n• Understanding customer behavior\n• Predicting trends\n• Automating manual work\n• Cutting down operational costs\n• Offering personalized experiences\n\nThese advantages help companies increase profits, strengthen customer loyalty, and stand out in competitive markets.\n\nMy approach is simple: build mobile apps that perform flawlessly, scale easily, and help businesses turn users into long-term customers.",
    },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    blogs.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleBlogs((prev) => {
              const newState = [...prev]
              newState[idx] = true
              return newState
            })
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      )

      const element = document.getElementById(`blog-${idx}`)
      if (element) {
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

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
          {blogs.map((blog, idx) => (
            <article
              key={blog.id}
              id={`blog-${idx}`}
              className={`glass-effect card-hover rounded-lg border border-primary/30 overflow-hidden scroll-fade-in ${
                visibleBlogs[idx] ? "visible" : ""
              } ${idx === 0 ? "scroll-stagger-1" : "scroll-stagger-2"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-br from-primary/20 to-secondary/20">
                  {/* Using img tag for HEIC files as Next.js Image doesn't support HEIC */}
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    {blog.title}
                  </h3>
                  <div className="text-foreground/80 leading-relaxed whitespace-pre-line">
                    {blog.content.split('\n').map((line, lineIdx) => {
                      // Check if line starts with bullet point
                      if (line.trim().startsWith('•')) {
                        return (
                          <div key={lineIdx} className="ml-4 mb-2">
                            {line}
                          </div>
                        )
                      }
                      // Check if line is empty (paragraph break)
                      if (line.trim() === '') {
                        return <div key={lineIdx} className="mb-4"></div>
                      }
                      // Regular paragraph
                      return (
                        <p key={lineIdx} className="mb-4 last:mb-0">
                          {line}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

