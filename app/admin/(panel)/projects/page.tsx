import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import { DeleteProject, DuplicateProject, MoveButtons, PublishToggle } from "@/components/admin/forms"

export default async function ProjectsAdmin() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from("projects")
    .select("id,title,slug,year,status,is_published,sort_order,created_at,screens,features")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
  const projects = data ?? []
  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Projects</h1>
          <p className="lead">The order here is the order on the site. Use the arrows to rearrange.</p>
        </div>
        <Link className="b solid" href="/admin/projects/new">+ New project</Link>
      </div>
      <table className="tbl stack">
        <thead><tr><th>ORDER</th><th>PROJECT</th><th>COMPLETENESS</th><th>VISIBILITY</th><th /></tr></thead>
        <tbody>
          {projects.map((p, i) => {
            const screens = Array.isArray(p.screens) ? p.screens.length : 0
            const features = Array.isArray(p.features) ? p.features.length : 0
            return (
              <tr key={p.id}>
                <td data-label="Order"><MoveButtons id={p.id} first={i === 0} last={i === projects.length - 1} /></td>
                <td data-label="Project">
                  <div className="t">{p.title}</div>
                  <div className="sub">/projects/{p.slug}{p.year ? ` · ${p.year}` : ""}</div>
                </td>
                <td data-label="Detail">
                  <span className={`chip${screens < 3 ? " off" : ""}`}>{screens} screens</span>{" "}
                  <span className={`chip${features < 5 ? " off" : ""}`}>{features} features</span>
                </td>
                <td data-label="Visibility"><PublishToggle table="projects" id={p.id} on={p.is_published} /></td>
                <td data-label="">
                  <div className="row-actions">
                    <Link className="b sm" href={`/admin/projects/${p.id}`}>Edit</Link>
                    {p.is_published && <a className="b sm" href={`/projects/${p.slug}`} target="_blank" rel="noreferrer">View ↗</a>}
                    <DuplicateProject id={p.id} />
                    <DeleteProject id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {projects.length === 0 && <p className="lead" style={{ marginTop: 20 }}>No projects yet. Add your first one.</p>}
      <p className="hint" style={{ marginTop: 14 }}>Grey chips mean the project is thin: aim for 3 or more screens and 5 or more features so clients see real detail.</p>
    </>
  )
}
