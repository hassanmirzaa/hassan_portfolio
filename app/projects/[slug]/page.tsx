import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import Contact from "@/components/contact"
import Chatbot from "@/components/chatbot"
import PhoneStack from "@/components/phone-stack"
import { getProjectBySlug, getProjects, PLATFORM_LABEL } from "@/lib/projects"
import { getSettings } from "@/lib/settings"
import { SITE_URL } from "@/lib/site"

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getProjectBySlug(slug)
  if (!p) return { title: "Project not found" }
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} · Hassan Mirza`, description: p.summary, url: `${SITE_URL}/projects/${p.slug}` },
  }
}

const STATUS = { live: "Live", in_development: "In development", archived: "Archived" } as const

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [all, settings] = await Promise.all([getProjects(), getSettings()])
  const idx = all.findIndex((p) => p.slug === slug)
  if (idx === -1) notFound()
  const p = all[idx]
  const next = all[(idx + 1) % all.length]

  const story = [
    ["The brief", p.problem],
    ["The build", p.approach],
    ["The result", p.outcome],
  ].filter((s): s is [string, string] => Boolean(s[1]))
  const stores = [
    [p.playStoreUrl, "Google Play ↗"],
    [p.appStoreUrl, "App Store ↗"],
    [p.liveUrl, "Live site ↗"],
    [p.githubUrl, "GitHub ↗"],
  ].filter((s): s is [string, string] => Boolean(s[0]))
  const single = p.screens.length === 1
  const isVideoFile = p.demoVideo ? /\.(mp4|webm)(\?|$)/i.test(p.demoVideo) : false

  const metaAll: [string, string | null | undefined][] = [
    ["Client", p.client],
    ["Role", p.role],
    ["Platforms", p.platforms.length ? p.platforms.map((x) => PLATFORM_LABEL[x]).join(" · ") : null],
    ["Year", p.year],
    ["Status", STATUS[p.status]],
  ]
  const meta = metaAll.filter((m): m is [string, string] => Boolean(m[1]))

  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main">
        <div className="wrap page-top">
          <Link className="back" href="/#work">
            ← All apps
          </Link>
          <h1 className="case-title">{p.title}</h1>
          <p className="case-sum">{p.summary}</p>

          <div className="meta">
            {meta.map(([k, v]) => (
              <div key={k}>
                <b>{k}</b>
                {v}
              </div>
            ))}
          </div>

          {stores.length > 0 && (
            <div className="show-links" style={{ marginTop: 28 }}>
              {stores.map(([u, l]) => (
                <a key={l} className="btn solid" href={u} target="_blank" rel="noopener noreferrer">
                  {l}
                </a>
              ))}
            </div>
          )}

          <div className="case-hero" style={{ ["--accent" as string]: p.accent }}>
            <PhoneStack screens={p.screens} title={p.title} sizes="(max-width: 760px) 44vw, 270px" />
            {single && (p.screens[0].caption || p.screens[0].text) && (
              <div className="case-note">
                {p.screens[0].caption && <b>{p.screens[0].caption}</b>}
                {p.screens[0].text && <p>{p.screens[0].text}</p>}
              </div>
            )}
          </div>

          <div className="case-body">
            <h2>About this app</h2>
            <p>{p.description}</p>
          </div>

          {p.highlights.length > 0 && (
            <div className="hls">
              {p.highlights.map((h) => (
                <div key={h.label}>
                  <b>{h.value}</b>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          )}

          {p.features.length > 0 && (
            <section className="case-feats" aria-labelledby="feats-title">
              <h2 id="feats-title">What it does</h2>
              <ol>
                {p.features.map((f, i) => (
                  <li key={f.title}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{f.title}</h3>
                    {f.text && <p>{f.text}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {p.screens.length > 1 && (
            <section className="case-shots" aria-labelledby="shots-title">
              <h2 id="shots-title">Every screen</h2>
              <div className="shots" style={{ ["--accent" as string]: p.accent }}>
                {p.screens.map((s, i) => (
                  <figure key={s.url + i}>
                    <div className="phone">
                      <Image className="shot" src={s.url} alt={s.alt ?? s.caption ?? `${p.title} screen ${i + 1}`} width={923} height={2000} sizes="(max-width: 760px) 70vw, 260px" />
                    </div>
                    <figcaption>
                      <b>{s.caption ?? `Screen ${i + 1}`}</b>
                      {s.text && <span>{s.text}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {p.demoVideo && (
            <section className="case-video">
              <h2>Demo</h2>
              {isVideoFile ? (
                <video controls playsInline preload="metadata" src={p.demoVideo} />
              ) : (
                <a className="btn line" href={p.demoVideo} target="_blank" rel="noopener noreferrer">
                  Watch the demo ↗
                </a>
              )}
            </section>
          )}

          {story.map(([t, body]) => (
            <div className="case-body" key={t}>
              <h2>{t}</h2>
              <p>{body}</p>
            </div>
          ))}

          {p.tech.length > 0 && (
            <div className="case-body">
              <h2>Built with</h2>
              <ul className="stack-tags" style={{ padding: 0 }}>
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {next && next.slug !== p.slug && (
          <Link href={`/projects/${next.slug}`} className="next">
            <div className="wrap">
              <small>Next app →</small>
              <div className="t">{next.title}</div>
            </div>
          </Link>
        )}
        <Contact settings={settings} />
      </main>
      <Chatbot />
    </>
  )
}
