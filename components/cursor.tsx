"use client"

import { useEffect, useRef } from "react"

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const el = ref.current
    if (!fine || reduce || !el) return
    document.body.classList.add("has-cursor")

    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      el.classList.add("on")
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const drag = t.closest(".drag")
      const link = t.closest("a, button, input, textarea, select")
      el.classList.toggle("big", Boolean(drag))
      el.classList.toggle("link", Boolean(link) && !drag)
      el.textContent = drag ? "drag" : ""
    }
    const leave = () => el.classList.remove("on")

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerover", over)
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      document.body.classList.remove("has-cursor")
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [])

  return <div className="cur" ref={ref} aria-hidden="true" />
}
