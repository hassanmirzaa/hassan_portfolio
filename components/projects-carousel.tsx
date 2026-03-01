"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { projects as fallbackProjects, type Project } from "@/lib/projects"

export default function ProjectsCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api || !carouselRef.current) return

    let isPaused = false
    let animationFrameId: number | null = null
    const scrollSpeed = 1 // pixels per frame - 1.5x speed (was 0.5)

    // Find the Embla container element that gets transformed
    const findContainer = (): HTMLElement | null => {
      const viewport = carouselRef.current?.querySelector('[data-slot="carousel-content"]') as HTMLElement
      return viewport?.firstElementChild as HTMLElement || null
    }

    const smoothScroll = () => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(smoothScroll)
        return
      }

      const container = findContainer()
      if (!container) {
        animationFrameId = requestAnimationFrame(smoothScroll)
        return
      }

      // Get current transform value
      const style = window.getComputedStyle(container)
      const matrix = new DOMMatrix(style.transform)
      let currentX = matrix.e // Current translateX value

      // Calculate scroll distance
      currentX -= scrollSpeed

      // Get container and viewport dimensions for loop calculation
      const containerWidth = container.scrollWidth
      const oneSetWidth = containerWidth / 3 // Since we have 3 sets of projects
      
      // Reset when we've scrolled one full set (seamless loop)
      if (Math.abs(currentX) >= oneSetWidth) {
        currentX = 0
      }

      // Apply transform directly (bypassing Embla for continuous scroll)
      container.style.transform = `translateX(${currentX}px)`
      container.style.willChange = 'transform'
      
      animationFrameId = requestAnimationFrame(smoothScroll)
    }

    const startAutoScroll = () => {
      if (animationFrameId !== null) return // Already running
      animationFrameId = requestAnimationFrame(smoothScroll)
    }

    const stopAutoScroll = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    // Start auto-scroll after carousel is ready (give it time to render)
    const initTimeout = setTimeout(() => {
      startAutoScroll()
    }, 1500)

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true
    }
    const handleMouseLeave = () => {
      isPaused = false
      if (animationFrameId === null) {
        startAutoScroll()
      }
    }

    if (carouselRef.current) {
      carouselRef.current.addEventListener("mouseenter", handleMouseEnter)
      carouselRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      clearTimeout(initTimeout)
      stopAutoScroll()
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("mouseenter", handleMouseEnter)
        carouselRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [api])
  return (
    <section id="projects-carousel" className="pt-0 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div id="auto-scroll-carousel" ref={carouselRef} className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true, // Enable loop for seamless scrolling
              dragFree: true, // Enable smooth dragging
              duration: 25,
              skipSnaps: true, // Skip snaps for continuous scroll
            }}
            className="w-full"
          >
          <CarouselContent className="-ml-2 md:-ml-4">
            {/* Duplicate items multiple times for seamless infinite scroll */}
            {[...projects, ...projects, ...projects].map((project, idx) => (
              <CarouselItem key={`${idx}-${project.title}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

