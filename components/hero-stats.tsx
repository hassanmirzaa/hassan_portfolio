"use client"

import { useState, useEffect, useRef } from "react"

interface StatCardProps {
  value: number
  maxValue: number
  label: string
  color: string
  isVisible: boolean
}

function CircularProgress({ value, maxValue, label, color, isVisible }: StatCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const percentage = (value / maxValue) * 100

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        setAnimatedValue(Math.floor(value * easeOut))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setAnimatedValue(value)
        }
      }
      animate()
    }
  }, [isVisible, value])

  const animatedPercentage = (animatedValue / maxValue) * 100
  const animatedOffset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="glass-effect p-8 rounded-lg border border-primary/30 hover:border-primary/60 transition-all duration-300 flex flex-col items-center group">
      <div className="relative w-40 h-40 mb-6">
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-primary/20"
          />
          <defs>
            <linearGradient id={`gradient-${label.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={`url(#gradient-${label.replace(/\s+/g, '-')})`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? animatedOffset : circumference}
            className="transition-all duration-2000 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(0, 217, 255, 0.5))",
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {animatedValue}+
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">{label}</div>
        <div className="text-xs text-foreground/40 mt-1">{percentage.toFixed(0)}% of target</div>
      </div>
    </div>
  )
}

export default function HeroStats() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { value: 60, maxValue: 100, label: "Projects", color: "primary" },
    { value: 30, maxValue: 50, label: "Clients", color: "secondary" },
    { value: 3, maxValue: 10, label: "Years", color: "primary" },
  ]

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-12 px-4">
      <div className="max-w-6xl mx-auto text-left">
        <div className="space-y-4 md:space-y-6 mb-12">
          <p className={`text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground/80 transition-all duration-1000 ease-out ${
            isVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-20"
          }`}>
            I make Apps that don't just look good — but high-performance apps built for{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-bold animate-gradient-shift">
              real-world functionality
            </span>
          </p>
          <p className={`text-xl md:text-2xl lg:text-3xl font-medium text-foreground/70 transition-all duration-1000 ease-out delay-200 ${
            isVisible 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-20"
          }`}>
            Built to scale, perform, and deliver real business value
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <CircularProgress
              key={stat.label}
              value={stat.value}
              maxValue={stat.maxValue}
              label={stat.label}
              color={stat.color}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

