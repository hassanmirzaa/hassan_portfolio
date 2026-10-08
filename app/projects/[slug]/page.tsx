import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "@/components/site-header"
import Contact from "@/components/contact"
import Chatbot from "@/components/chatbot"
import { getProjectBySlug, getProjects, type Screen } from "@/lib/projects"
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

  const screens: Screen[] = p.screens.length ? p.screens.slice(0, 4) : p.image ? [{ url: p.image, alt: `${p.title} app screen` }] : []
  const sections = [
    ["The brief", p.problem],
    ["The build", p.approach],
    ["The result", p.outcome],
  ].filter((s): s is [string, string] => Boolean(s[1]))

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
            <div>
              <b>Role</b>
              {p.role ?? "Design, app and backend"}
            </div>
            {p.year && (
              <div>
                <b>Year</b>
                {p.year}
              </div>
            )}
            <div>
              <b>Status</b>
              {STATUS[p.status]}
            </div>
            <div>
              <b>Links</b>
              {[
                [p.playStoreUrl, "Google Play ↗"],
                [p.appStoreUrl, "App Store ↗"],
                [p.liveUrl, "Live site ↗"],
                [p.githubUrl, "GitHub ↗"],
              ].some(([u]) => u) ? (
                [
                  [p.playStoreUrl, "Google Play ↗"],
                  [p.appStoreUrl, "App Store ↗"],
                  [p.liveUrl, "Live site ↗"],
                  [p.githubUrl, "GitHub ↗"],
                ].map(([u, l]) =>
                  u ? (
                    <a key={l} href={u} target="_blank" rel="noopener noreferrer">
                      {l}
                    </a>
                  ) : null,
                )
              ) : (
                <>Private, internal app</>
              )}
            </div>
          </div>

          {screens.length > 0 && (
            <div className="case-stage" style={{ ["--accent" as string]: p.accent }}>
              {screens.map((s, i) => (
                <div className="phone" key={s.url + i}>
                  <Image className="shot" src={s.url} alt={s.alt ?? s.caption ?? `${p.title} screen ${i + 1}`} width={923} height={2000} sizes="(max-width: 760px) 44vw, 270px" priority={i === 0} />
                </div>
              ))}
            </div>
          )}

          <div className="case-body">
            <h2>About this app</h2>
            <p>{p.description}</p>
          </div>
          {sections.map(([t, body]) => (
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
