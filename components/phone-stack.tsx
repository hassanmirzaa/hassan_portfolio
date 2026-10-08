import Image from "next/image"
import type { Screen } from "@/lib/projects"

// Overlapping phone mockups. 1 screen = one large phone, 2 or 3 = a tilted fan.
export default function PhoneStack({ screens, title, sizes }: { screens: Screen[]; title: string; sizes: string }) {
  const list = screens.slice(0, 3)
  if (list.length === 0) return null
  return (
    <div className={`pstack n${list.length}`}>
      {list.map((s, i) => (
        <div className="phone" key={s.url + i}>
          <Image
            className="shot"
            src={s.url}
            alt={s.alt ?? s.caption ?? `${title} screen ${i + 1}`}
            width={923}
            height={2000}
            sizes={sizes}
          />
        </div>
      ))}
    </div>
  )
}
