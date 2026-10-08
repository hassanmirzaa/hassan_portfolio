import WorkList from "@/components/work-list"
import type { Project } from "@/lib/projects"

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
          <p>Each one started as a brief and ended in a store listing. Open any row for the full story.</p>
        </div>
        <WorkList projects={projects} />
      </div>
    </section>
  )
}
