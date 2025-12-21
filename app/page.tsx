"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Process from "@/components/process"
import ProjectsCarousel from "@/components/projects-carousel"
import HeroStats from "@/components/hero-stats"
import About from "@/components/about"
import Experience from "@/components/experience"
import Testimonials from "@/components/testimonials"
import Blogs from "@/components/blogs"
import Contact from "@/components/contact"
import FloatingCTA from "@/components/floating-cta"
import ProgressBar from "@/components/progress-bar"
import BackgroundAnimation from "@/components/background-animation"
import CursorGlow from "@/components/cursor-glow"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(scrollPercent)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <CursorGlow />
      <BackgroundAnimation />
      <ProgressBar progress={scrollProgress} />
      <Navbar />
      <Hero />
      <ProjectsCarousel />
      <HeroStats />
      <Testimonials />
      <Services />
      <Process />
      <About />
      <Experience />
      <Blogs />
      <Contact />
      <FloatingCTA />
    </main>
  )
}
