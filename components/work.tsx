import Link from "next/link"
import CoverStack from "@/components/cover-stack"
import { PLATFORM_LABEL, type Project } from "@/lib/projects"

const MAX_CHIPS = 5

// True when the card colour is light enough that white text would disappear on it.
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter((w) => /^[a-z0-9]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")
}

// Platforms for live apps, otherwise the status.
function tagLine(p: Project) {
  if (p.status === "in_development") return "In development"
  if (p.status === "archived") return "Archived"
  return p.platforms.map((x) => PLATFORM_LABEL[x]).join(" · ")
}

// Bento grid: every app visible at once, the first (by admin order) featured large.
export default function Work({ projects }: { projects: Project[] }) {
  return (
    <section className="s" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="head rv">
          <div>
            <div className="eyebrow">Selected work · {String(projects.length).padStart(2, "0")}</div>
            <h2 className="h2" id="work-title">
              Apps I&apos;ve <em>shipped</em>
              <br />
              end to end.
            </h2>
          </div>
          <p>Each one started as a brief and ended in a store listing. Open any app for every screen, feature and detail.</p>
        </div>

        <div className="bento rv">
          {projects.map((p, i) => (
            <Tile key={p.slug} p={p} i={i} big={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Tile({ p, i, big }: { p: Project; i: number; big: boolean }) {
  const tag = tagLine(p)
  const more = p.features.length - MAX_CHIPS
  return (
    <Link
      className={`bt${big ? " big" : ""}${isLight(p.accent) ? " lt" : ""}`}
      href={`/projects/${p.slug}`}
      style={{ ["--accent" as string]: p.accent }}
      aria-label={`${p.title}: ${p.summary}`}
    >
      <div className="bt-top">
        <span>{String(i + 1).padStart(2, "0")}</span>
        <span className="bt-go" aria-hidden="true">
          →
        </span>
      </div>
      <div className="bt-copy">
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        {big && p.features.length > 0 && (
          <ul className="bt-feats">
            {p.features.slice(0, MAX_CHIPS).map((f) => (
              <li key={f.title}>{f.title}</li>
            ))}
            {more > 0 && <li className="more">+{more}</li>}
          </ul>
        )}
      </div>
      <div className="bt-stage">
        {tag && <span className="bt-tag">{tag}</span>}
        <CoverStack screens={p.screens} monogram={initials(p.title)} sizes={big ? "(max-width: 600px) 30vw, 220px" : "(max-width: 600px) 22vw, 120px"} />
      </div>
    </Link>
  )
}
