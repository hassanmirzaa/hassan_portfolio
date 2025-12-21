"use client"

import { useEffect, useState } from "react"

export default function Experience() {
  const [visibleExperiences, setVisibleExperiences] = useState<boolean[]>([])
  const experiences = [
    {
      title: "Flutter Developer",
      company: "Ismail Industries Ltd",
      period: "2023 - Present",
      description: "Developing and maintaining cross-platform mobile applications using Flutter. Working on production apps with Firebase integration, state management, and modern mobile architectures.",
    },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    
    experiences.forEach((_, idx) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleExperiences((prev) => {
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

      const element = document.getElementById(`experience-${idx}`)
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
    <section id="experience" className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">Experience</span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 scroll-fade-in scroll-stagger-1">Professional journey and key milestones in my career.</p>

        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              id={`experience-${idx}`}
              className={`glass-effect card-hover p-6 rounded-lg border border-primary/30 relative scroll-fade-in ${
                visibleExperiences[idx] ? "visible" : ""
              } ${idx === 0 ? "scroll-stagger-1" : idx === 1 ? "scroll-stagger-2" : idx === 2 ? "scroll-stagger-3" : "scroll-stagger-4"}`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-l-lg" />
              <h3 className="text-xl font-bold text-primary ml-4">{exp.title}</h3>
              <p className="text-foreground/70 ml-4 mt-1">{exp.company}</p>
              <p className="text-sm text-foreground/50 ml-4 mt-2">{exp.period}</p>
              <p className="text-foreground/70 ml-4 mt-3">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
