"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Projects() {
  const projects = [
    {
      title: "Waterverse Connect",
      description: "A comprehensive mobile application for Waterverse customers to manage orders, track deliveries, process payments, view deals, and access customer support. Features real-time order tracking with Google Maps integration, secure payment processing, push notifications, and a seamless user experience.",
      tech: ["Flutter", "Firebase", "Payment Gateway", "Push Notifications", "Google Maps API"],
      color: "from-primary/40",
      image: "/waterverse-connect.png",
      metrics: "Production App",
      link: 'https://play.google.com/store/apps/details?id=com.ig.waterverse&pcampaignid=web_share', // Add app store link if available
    },
    {
      title: "AI Workout Planner",
      description: "An intelligent fitness application that generates personalized workout plans using AI. Users input their fitness goals, available equipment, and preferences, and the app creates customized workout routines. Features include progress tracking, exercise demonstrations, and adaptive planning based on user feedback.",
      tech: ["Flutter", "Supabase", "OpenAI API", "Node.js"],
      color: "from-secondary/40",
      image: "/ai-workout-planner.png",
      metrics: "AI-Powered Solution",
      link: null, // Add app store link if available
    },
    {
      title: "Orange POS & Delivery System",
      description: "A complete Point of Sale and delivery management system for Orange stores. Enables store owners to manage inventory, process orders, handle payments, track deliveries with real-time GPS, implement geo-fencing for delivery zones, apply dynamic discounts, and manage customer complaints through real-time communication.",
      tech: ["Flutter", "Firebase", "Pusher (Real-time)", "SQLite", "Laravel Backend"],
      color: "from-primary/40",
      image: "/orange-pos.jpg",
      metrics: "Enterprise Solution",
      link: null, // Add app store link if available
    },
    {
      title: "Tusai - AI Recipe Generator",
      description: "A smart recipe application that generates personalized recipes based on available ingredients. Users input what they have in their kitchen, and the AI creates custom recipes with step-by-step instructions. Features include recipe saving, shopping lists, dietary preferences, and monetization through Google Ads.",
      tech: ["Flutter", "Google Ads", "Firebase", "OpenAI API"],
      color: "from-secondary/40",
      image: "/tusai.png",
      metrics: "AI-Powered App",
      link: null, // Add app store link if available
    },
  ]

  const [visibleProjects, setVisibleProjects] = useState<boolean[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    projects.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleProjects((prev) => {
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

      const element = document.getElementById(`project-${idx}`)
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
    <section id="projects" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">
            Featured Projects
          </span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto scroll-fade-in scroll-stagger-1">
          Production-ready mobile applications built with Flutter, showcasing real-world solutions and technical expertise.
        </p>

        <div className="space-y-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              id={`project-${idx}`}
              className={`glass-effect card-hover p-8 rounded-lg border border-primary/30 bg-gradient-to-r ${project.color} to-transparent scroll-fade-in ${
                visibleProjects[idx] ? "visible" : ""
              } ${idx === 0 ? "scroll-stagger-1" : idx === 1 ? "scroll-stagger-2" : idx === 2 ? "scroll-stagger-3" : idx === 3 ? "scroll-stagger-4" : "scroll-stagger-5"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-primary">{project.title}</h3>
                  {project.metrics && (
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-semibold border border-secondary/40">
                        {project.metrics}
                      </span>
                    </div>
                  )}
                  <p className="text-foreground/70 mb-6 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm font-medium"
                    >
                      View on App Store →
                    </a>
                  )}
                </div>
                <div className="relative h-64 rounded-lg border border-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 group/image">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover image-hover transition-transform duration-500 group-hover/image:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-foreground/40">Project Preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
