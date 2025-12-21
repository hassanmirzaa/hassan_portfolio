"use client"

import { useState, useEffect, useRef } from "react"

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const rafRef = useRef<number>()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
        setIsVisible(true)
      })
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Main glow effect */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 217, 255, 0.08), rgba(99, 102, 241, 0.05), transparent 50%)`,
        }}
      />
      {/* Secondary glow for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: isVisible ? 0.5 : 0,
          background: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 217, 255, 0.1), transparent 40%)`,
        }}
      />
    </>
  )
}


