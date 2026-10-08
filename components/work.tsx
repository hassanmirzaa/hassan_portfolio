import Link from "next/link"
import PhoneStack from "@/components/phone-stack"
import { PLATFORM_LABEL, type Project } from "@/lib/projects"

const MAX_CHIPS = 5

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

        <div className="shows">
          {projects.map((p, i) => {
            const more = p.features.length - MAX_CHIPS
            return (
              <article className="show rv" key={p.slug} style={{ ["--accent" as string]: p.accent }}>
                <div className="show-copy">
                  <div className="show-top">
                    {String(i + 1).padStart(2, "0")}
                    {p.client ? ` · ${p.client}` : ""}
                    {p.year ? ` · ${p.year}` : ""}
                  </div>
                  <h3>
                    <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="show-lead">{p.description || p.summary}</p>

                  {p.features.length > 0 && (
                    <ul className="feats" aria-label="Key features">
                      {p.features.slice(0, MAX_CHIPS).map((f) => (
                        <li key={f.title}>{f.title}</li>
                      ))}
                      {more > 0 && <li className="more">+{more} more</li>}
                    </ul>
                  )}

                  <div className="show-meta">
                    {p.platforms.length > 0 && <span>{p.platforms.map((x) => PLATFORM_LABEL[x]).join(" · ")}</span>}
                    {p.tech.length > 0 && <span>{p.tech.slice(0, 4).join(" · ")}</span>}
                    {p.status !== "live" && <span>{p.status === "in_development" ? "In development" : "Archived"}</span>}
                  </div>

                  <div className="show-links">
                    <Link className="btn solid" href={`/projects/${p.slug}`}>
                      Full case study <span className="ar">→</span>
                    </Link>
                    {p.playStoreUrl && (
                      <a className="btn line" href={p.playStoreUrl} target="_blank" rel="noopener noreferrer">
                        Google Play ↗
                      </a>
                    )}
                    {p.appStoreUrl && (
                      <a className="btn line" href={p.appStoreUrl} target="_blank" rel="noopener noreferrer">
                        App Store ↗
                      </a>
                    )}
                  </div>
                </div>

                <Link className="show-art" href={`/projects/${p.slug}`} aria-label={`${p.title} case study`}>
                  <PhoneStack screens={p.screens} title={p.title} sizes="(max-width: 820px) 44vw, 240px" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
