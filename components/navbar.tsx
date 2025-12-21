"use client"

import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const navItems = ["Home", "Services", "Projects", "About", "Contact"]

  return (
    <nav 
      className="sticky top-0 z-50 relative overflow-hidden group/nav"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 navbar-grid-bg" />
      </div>

      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-scan" />

      {/* Glass morphism with enhanced blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-primary/30" />
      
      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 217, 255, 0.15), transparent 40%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with holographic effect */}
          <div className="relative group">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary via-secondary to-primary opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-gradient-shift" 
                 style={{ backgroundSize: '200% 200%' }} />
            <div className="relative text-2xl font-bold animate-gradient-shift"
                 style={{ backgroundSize: '200% 200%' }}>
              {/* Base text for visibility - always visible */}
              <span className="relative z-10 text-primary drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]">
                Hassan Mirza
              </span>
              {/* Gradient overlay effect */}
              <span className="absolute inset-0 z-20 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent opacity-80 animate-gradient-shift pointer-events-none"
                    style={{ backgroundSize: '200% 200%' }}>
                Hassan Mirza
              </span>
              {/* Glitch effect on hover */}
              <span className="absolute inset-0 text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent opacity-0 group-hover:opacity-20 group-hover:translate-x-1 transition-all duration-300 blur-sm z-30 pointer-events-none">
                Hassan Mirza
              </span>
            </div>
            {/* Particle dots around logo */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Desktop menu with futuristic effects */}
          <div className="hidden md:flex gap-2">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.toLowerCase())
                  element?.scrollIntoView({ behavior: "smooth" })
                }}
                className="relative px-4 py-2 text-foreground/70 hover:text-primary transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover glow background */}
                <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 blur-sm group-hover:blur-none" />
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary rounded-br-lg" />
                  </div>
                </div>

                {/* Text with glow */}
                <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.6)] transition-all duration-300">
                  {item}
                </span>

                {/* Bottom indicator line */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-full transition-all duration-500" />
                
                {/* Floating particles on hover */}
                <div className="absolute -top-1 -right-1 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
              </a>
            ))}
          </div>

          {/* Mobile menu button with futuristic design */}
          <button 
            className="md:hidden relative p-2 text-foreground hover:text-primary transition-all duration-300 group"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
            <svg 
              className="w-6 h-6 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.6)] transition-all duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu with animations */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in relative">
            {/* Animated background for mobile menu */}
            <div className="absolute inset-0 -mx-4 rounded-b-lg bg-primary/5 border-t border-primary/20" />
            
            {navItems.map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  const element = document.getElementById(item.toLowerCase())
                  element?.scrollIntoView({ behavior: "smooth" })
                }}
                className="relative block text-foreground/70 hover:text-primary transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary/10 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {item}
                </span>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-lg" />
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
