import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectBySlug, getProjectSlugs, type Project } from "@/lib/projects"
import Navbar from "@/components/navbar"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} | Hassan Mirza`,
    description: project.longDescription ?? project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const body = project.longDescription ?? project.description

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/#projects-carousel"
            className="inline-flex items-center gap-2 text-primary/80 hover:text-primary text-sm font-medium mb-8 transition-colors"
          >
            <span aria-hidden>←</span> Back to Projects
          </Link>

          {/* Hero image */}
          <div className="relative w-full aspect-video rounded-xl border border-primary/30 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 mb-8">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {project.year && (
              <span className="text-foreground/60 text-sm">{project.year}</span>
            )}
            {project.category && (
              <>
                <span className="text-foreground/40">•</span>
                <span className="text-foreground/60 text-sm">{project.category}</span>
              </>
            )}
            {project.rating != null && (
              <>
                <span className="text-foreground/40">•</span>
                <span className="text-sm text-foreground/80">
                  <span className="text-yellow-400">⭐</span> {project.rating}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {project.title}
          </h1>

          {/* Metrics badge */}
          <div className="mb-6">
            <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold border border-secondary/40">
              {project.metrics}
            </span>
          </div>

          {/* Full description */}
          <div className="prose prose-invert prose-primary max-w-none mb-10">
            <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
              {body}
            </p>
          </div>

          {/* Demo Video */}
          {project.demoVideo && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-3">Demo</h2>
              <div className="relative w-full aspect-video rounded-xl border border-primary/30 overflow-hidden">
                <video
                  src={project.demoVideo}
                  controls
                  className="w-full h-full object-contain bg-black"
                  preload="metadata"
                />
              </div>
            </section>
          )}

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-3">Screenshots</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {project.screenshots.map((src, i) => (
                  <div key={i} className="relative w-56 h-[400px] flex-shrink-0 rounded-xl border border-primary/30 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover" sizes="224px" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tech stack */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-sm border border-primary/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-primary/20">
            {project.playStoreUrl && (
              <a
                href={project.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors border border-primary/40"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92ZM14.852 13.06l2.36 2.36-9.676 5.497 7.316-7.856ZM18.44 10.18l2.883 1.638a1 1 0 0 1 0 1.738l-2.882 1.637L15.667 12l2.774-1.82ZM7.536 3.083l9.676 5.498-2.36 2.36-7.316-7.858Z" />
                </svg>
                View on Play Store
              </a>
            )}
            <Link
              href="/#contact"
              className="px-6 py-3 border border-primary/40 text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
