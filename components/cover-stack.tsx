"use client"

import Image from "next/image"
import { useState } from "react"
import { coverScreens } from "@/lib/cover"
import type { Screen } from "@/lib/projects"

// Up to three phones (a tilted fan): the ones picked in the admin, else the first three screens.
// Screens that fail to load drop out; with none left the project's monogram shows instead.
export default function CoverStack({ screens, monogram, sizes }: { screens: Screen[]; monogram: string; sizes: string }) {
  const [bad, setBad] = useState<string[]>([])
  const list = coverScreens(screens).filter((s) => !bad.includes(s.url)).slice(0, 3)
  if (list.length === 0) return <span className="bt-mono">{monogram}</span>
  return (
    <div className={`pstack n${list.length}`}>
      {list.map((s) => (
        <div className="phone" key={s.url}>
          <Image
            className="shot"
            src={s.url}
            alt=""
            width={923}
            height={2000}
            sizes={sizes}
            draggable={false}
            onError={() => setBad((b) => [...b, s.url])}
          />
        </div>
      ))}
    </div>
  )
}
