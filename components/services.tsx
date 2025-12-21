"use client"

import { useEffect, useState } from "react"

export default function Services() {
  const [visibleServices, setVisibleServices] = useState<boolean[]>([])
  const services = [
    {
      icon: "📱",
      title: "Flutter Development",
      description: "Building cross-platform iOS and Android applications with Flutter, ensuring native performance and beautiful UI.",
    },
    {
      icon: "🔥",
      title: "Firebase & Supabase Integration",
      description: "Seamless integration with Firebase and Supabase for authentication, real-time databases, cloud functions, storage, and analytics.",
    },
    {
      icon: "⚡",
      title: "Mobile Architecture",
      description: "Designing scalable mobile app architectures with clean code principles, state management, and best practices.",
    },
    {
      icon: "🎨",
      title: "Mobile UI/UX Design",
      description: "Creating intuitive, user-friendly mobile interfaces that follow platform guidelines and design best practices.",
    },
    {
      icon: "🚀",
      title: "App Store Optimization",
      description: "Preparing and deploying apps to Google Play Store and Apple App Store with optimized listings and metadata.",
    },
    {
      icon: "🔧",
      title: "API & AI Integrations",
      description: "Integrating RESTful APIs, AI capabilities (OpenAI, ML models), handling authentication, error management, and intelligent features.",
    },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    services.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleServices((prev) => {
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

      const element = document.getElementById(`service-${idx}`)
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
    <section id="services" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">Services</span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto scroll-fade-in scroll-stagger-1">
          Specialized mobile development services to build, deploy, and optimize your iOS and Android applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              id={`service-${idx}`}
              className={`glass-effect card-hover p-8 rounded-lg border border-primary/30 group cursor-pointer scroll-fade-in ${
                visibleServices[idx] ? "visible" : ""
              } ${idx === 0 ? "scroll-stagger-1" : idx === 1 ? "scroll-stagger-2" : idx === 2 ? "scroll-stagger-3" : idx === 3 ? "scroll-stagger-4" : idx === 4 ? "scroll-stagger-5" : "scroll-stagger-6"}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">{service.title}</h3>
              <p className="text-foreground/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
