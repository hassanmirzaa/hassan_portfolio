"use client"

import { useEffect, useState } from "react"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".card-hover") ||
        target.closest(".btn-interactive")
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", updateCursor)
    document.addEventListener("mouseover", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mouseover", handleMouseEnter)
    }
  }, [])

  return (
    <div
      className={`fixed pointer-events-none z-50 mix-blend-difference transition-all duration-300 ${
        isHovering ? "scale-150" : "scale-100"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${isHovering ? "scale(1.5)" : "scale(1)"}`,
      }}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 border-primary transition-all duration-300 ${
          isHovering ? "bg-primary/20" : "bg-transparent"
        }`}
      />
    </div>
  )
}

