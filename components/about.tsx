"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    )

    const element = document.getElementById("about-section")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="about" className="py-12 px-4">
      <div id="about-section" className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift">About Me</span>
        </h2>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center scroll-fade-in scroll-stagger-1 ${isVisible ? "visible" : ""}`}>
          <div className={`glass-effect card-hover p-8 rounded-lg border border-primary/30 scroll-fade-in scroll-stagger-2 ${isVisible ? "visible" : ""}`}>
            <div className="relative h-96 md:h-[500px] rounded-lg border border-primary/20 overflow-hidden">
              <Image
                src="/hassan.png"
                alt="Hassan Mirza"
                fill
                className="object-cover image-hover"
                priority
              />
            </div>
          </div>

          <div className={`scroll-fade-in scroll-stagger-3 ${isVisible ? "visible" : ""}`}>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              I'm a passionate Flutter developer with 3+ years of experience building cross-platform mobile applications. 
              My journey in mobile development started with a fascination for creating apps that work seamlessly on both iOS 
              and Android, which led me to specialize in Flutter and modern mobile development practices.
            </p>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              I specialize in developing production-ready mobile applications using Flutter, with expertise in Firebase, 
              Supabase, state management, and mobile architecture patterns. I'm passionate about writing clean, maintainable 
              code and creating intuitive user experiences that perform exceptionally across all devices.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Flutter cross-platform development</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Firebase & Supabase integration</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>State management (Provider, Riverpod, Bloc)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Mobile UI/UX design & optimization</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>RESTful API integration</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>App Store deployment & optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
