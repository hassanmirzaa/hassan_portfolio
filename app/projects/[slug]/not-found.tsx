import Link from "next/link"

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-primary mb-2">Project not found</h1>
      <p className="text-foreground/70 mb-6 text-center">
        The project you’re looking for doesn’t exist or has been removed.
      </p>
      <Link
        href="/#projects-carousel"
        className="px-6 py-3 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors border border-primary/40"
      >
        Back to Projects
      </Link>
    </main>
  )
}
