"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { projects as fallbackProjects, type Project } from "@/lib/projects"

export default function ProjectsCarousel() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const carouselRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const container = carouselRef.current
    if (!track || !container) return

    // Respect users who prefer reduced motion.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const scrollSpeed = 0.6 // pixels per frame (~36px/s at 60fps)

    // We own the transform entirely — no other library touches it, so there
    // is nothing to fight with and the position can never be clobbered.
    let offset = 0
    // Width of a single copy of the list. The track renders the list twice,
    // so wrapping at exactly half the width produces a seamless loop.
    let oneSetWidth = track.scrollWidth / 2
    let isPaused = false
    let animationFrameId: number | null = null

    const measure = () => {
      oneSetWidth = track.scrollWidth / 2
    }

    const step = () => {
      if (!isPaused && oneSetWidth > 0) {
        offset -= scrollSpeed
        // Wrap by ADDING one set width (not snapping to 0) so the visible
        // position stays continuous — no visible jump.
        if (offset <= -oneSetWidth) {
          offset += oneSetWidth
        }
        track.style.transform = `translate3d(${offset}px, 0, 0)`
      }
      animationFrameId = requestAnimationFrame(step)
    }

    // Recompute the set width once images/layout settle and on resize.
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)

    // Give layout/images a moment before first measure, then start.
    const initTimeout = setTimeout(() => {
      measure()
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(step)
      }
    }, 300)

    const handleMouseEnter = () => {
      isPaused = true
    }
    const handleMouseLeave = () => {
      isPaused = false
    }

    // Pause while the tab is hidden so we don't accumulate a huge jump on return.
    const handleVisibility = () => {
      isPaused = document.hidden
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      clearTimeout(initTimeout)
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [projects])

  return (
    <section id="projects-carousel" className="pt-0 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          id="auto-scroll-carousel"
          ref={carouselRef}
          className="relative overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            {/* List rendered twice for a seamless, continuous loop */}
            {[...projects, ...projects].map((project, idx) => (
              <div
                key={`${idx}-${project.title}`}
                className="shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-2 md:pl-4"
              >
                <div className="glass-effect card-hover p-6 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent h-full flex flex-col group">
                  {/* Image */}
                  <div className="relative h-48 rounded-lg border border-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 group-hover/image:scale-105 transition-transform duration-500">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading={idx < 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-foreground/40">Project Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Rating and Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-sm font-semibold text-foreground">{project.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/60">{project.year}</span>
                      <span className="text-xs text-foreground/60">•</span>
                      <span className="text-xs text-foreground/60">{project.category}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-secondary transition-colors">
                    {project.title}
                  </h3>

                  {/* Metrics Badge */}
                  {project.metrics && (
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-semibold border border-secondary/40">
                        {project.metrics}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-foreground/70 text-sm mb-4 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs border border-primary/40"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary/70 rounded-full text-xs border border-primary/30">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/30 text-center"
                    >
                      View Details
                    </Link>
                    {project.playStoreUrl ? (
                      <a
                        href={project.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 border border-primary/30 text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors text-center inline-flex items-center justify-center gap-1.5"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                          <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92ZM14.852 13.06l2.36 2.36-9.676 5.497 7.316-7.856ZM18.44 10.18l2.883 1.638a1 1 0 0 1 0 1.738l-2.882 1.637L15.667 12l2.774-1.82ZM7.536 3.083l9.676 5.498-2.36 2.36-7.316-7.858Z" />
                        </svg>
                        Play Store
                      </a>
                    ) : (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex-1 px-4 py-2 border border-primary/30 text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors text-center"
                      >
                        Case Study
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
