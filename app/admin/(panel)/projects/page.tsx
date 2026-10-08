import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import { DeleteProject, PublishToggle } from "@/components/admin/forms"

export default async function ProjectsAdmin() {
  const { supabase } = await requireAdmin()
  const { data: projects } = await supabase.from("projects").select("id,title,slug,year,status,is_published,sort_order,summary").order("sort_order", { ascending: true })
  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Projects</h1>
          <p className="lead">Order, edit and publish the apps shown on the site.</p>
        </div>
        <Link className="b solid" href="/admin/projects/new">+ New project</Link>
      </div>
      <table className="tbl">
        <thead><tr><th>#</th><th>PROJECT</th><th>YEAR</th><th>STATUS</th><th>VISIBILITY</th><th /></tr></thead>
        <tbody>
          {(projects ?? []).map((p) => (
            <tr key={p.id}>
              <td>{p.sort_order}</td>
              <td><div className="t">{p.title}</div><div className="sub">/projects/{p.slug}</div></td>
              <td>{p.year ?? "—"}</td>
              <td><span className="chip">{p.status ?? "live"}</span></td>
              <td><PublishToggle table="projects" id={p.id} on={p.is_published} /></td>
              <td><div className="row-actions"><Link className="b sm" href={`/admin/projects/${p.id}`}>Edit</Link><DeleteProject id={p.id} title={p.title} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      {(projects ?? []).length === 0 && <p className="lead" style={{ marginTop: 20 }}>No projects yet. Add your first one.</p>}
    </>
  )
}
