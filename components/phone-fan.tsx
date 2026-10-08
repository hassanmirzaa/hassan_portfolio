"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const APPS = [
  { cls: "p1", src: "/projects/innova-pm.jpg", name: "Innova PM", tr: -3 },
  { cls: "p2", src: "/projects/waterverse-connect.jpg", name: "Waterverse Connect", tr: 2 },
  { cls: "p3", src: "/projects/waterverse-command.jpg", name: "Waterverse Command", tr: -2 },
  { cls: "p4", src: "/projects/ismail-hr-app.jpg", name: "Ismail HR App", tr: 4 },
]

export default function PhoneFan() {
  const stage = useRef<HTMLDivElement>(null)
  const fan = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stageEl = stage.current
    const fanEl = fan.current
    if (!stageEl || !fanEl) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let z = 10
    const cleanups: (() => void)[] = []

    if (!reduce) {
      const move = (e: PointerEvent) => {
        if (stageEl.querySelector(".held") || e.pointerType !== "mouse") return
        const b = stageEl.getBoundingClientRect()
        const px = (e.clientX - b.left) / b.width - 0.5
        const py = (e.clientY - b.top) / b.height - 0.5
        fanEl.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 7}deg)`
      }
      const leave = () => (fanEl.style.transform = "")
      stageEl.addEventListener("pointermove", move)
      stageEl.addEventListener("pointerleave", leave)
      cleanups.push(() => {
        stageEl.removeEventListener("pointermove", move)
        stageEl.removeEventListener("pointerleave", leave)
      })
    }

    stageEl.querySelectorAll<HTMLElement>(".drag").forEach((el) => {
      let sx = 0,
        sy = 0,
        ox = 0,
        oy = 0
      const down = (e: PointerEvent) => {
        el.setPointerCapture(e.pointerId)
        ox = parseFloat(el.style.getPropertyValue("--x")) || 0
        oy = parseFloat(el.style.getPropertyValue("--y")) || 0
        sx = e.clientX
        sy = e.clientY
        el.classList.add("held")
        el.style.zIndex = String(++z)
        fanEl.style.transform = ""
      }
      const move = (e: PointerEvent) => {
        if (!el.classList.contains("held")) return
        el.style.setProperty("--x", ox + e.clientX - sx + "px")
        el.style.setProperty("--y", oy + e.clientY - sy + "px")
      }
      const up = () => el.classList.remove("held")
      el.addEventListener("pointerdown", down)
      el.addEventListener("pointermove", move)
      el.addEventListener("pointerup", up)
      el.addEventListener("pointercancel", up)
      cleanups.push(() => {
        el.removeEventListener("pointerdown", down)
        el.removeEventListener("pointermove", move)
        el.removeEventListener("pointerup", up)
        el.removeEventListener("pointercancel", up)
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <div className="stage" ref={stage}>
      <div className="fan" ref={fan}>
        {APPS.map((a, i) => (
          <div className={`drag ${a.cls}`} key={a.cls}>
            <div className="phone">
              <Image
                className="shot"
                src={a.src}
                alt={`${a.name} app screen`}
                width={923}
                height={2000}
                sizes="(max-width: 820px) 28vw, 220px"
                priority={i < 2}
                draggable={false}
              />
              <div className="tag" style={{ ["--tr" as string]: `${a.tr}deg` }}>
                {a.name}
              </div>
            </div>
          </div>
        ))}
        <div className="drag note">
          Need an app shipped? Ask me.
          <small>H.</small>
        </div>
        <div className="drag sticker st1">Flutter</div>
        <div className="drag sticker st2">Laravel</div>
        <div className="drag sticker st3">Node.js</div>
      </div>
      <div className="hint" aria-hidden="true">
        ✥ drag anything
      </div>
    </div>
  )
}
