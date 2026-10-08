"use client"

import { useRef } from "react"
import Link from "next/link"
import type { Project } from "@/lib/projects"

export default function WorkList({ projects }: { projects: Project[] }) {
  const peek = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  const show = (p: Project, i: number) => {
    const el = peek.current
    if (!el || !img.current || !label.current) return
    img.current.src = p.image
    img.current.alt = ""
    el.style.background = p.accent
    el.style.setProperty("--pr", `${i % 2 ? -7 : 7}deg`)
    label.current.textContent = p.title
    el.classList.add("on")
  }
  const hide = () => peek.current?.classList.remove("on")
  const follow = (e: React.PointerEvent) => {
    const el = peek.current
    if (!el || e.pointerType !== "mouse") return
    el.style.left = e.clientX + "px"
    el.style.top = e.clientY + "px"
  }

  return (
    <>
      <div className="idx-list" onPointerMove={follow}>
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="idx rv"
            data-peek
            onPointerEnter={(e) => e.pointerType === "mouse" && p.image && show(p, i)}
            onPointerLeave={hide}
            onBlur={hide}
          >
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <span className="t">{p.title}</span>
            <span className="d">{p.summary}</span>
            <span className="y">{p.tech.slice(0, 2).join(" · ")}</span>
            <span className="a" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
      <div className="peek" ref={peek} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={img} alt="" />
        <span ref={label} />
      </div>
    </>
  )
}
