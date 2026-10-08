import Link from "next/link"
import { requireAdmin } from "@/lib/admin"

export default async function Overview() {
  const { supabase } = await requireAdmin()
  const count = async (table: string, filter?: (q: any) => any) => {
    const q = supabase.from(table).select("*", { count: "exact", head: true })
    const { count: c } = await (filter ? filter(q) : q)
    return c ?? 0
  }
  const [projects, drafts, blogs, newLeads, leads] = await Promise.all([
    count("projects"),
    count("projects", (q) => q.eq("is_published", false)),
    count("blogs"),
    count("portfolio_leads", (q) => q.eq("status", "new")),
    count("portfolio_leads"),
  ])
  const { data: recent } = await supabase.from("portfolio_leads").select("id,name,message,created_at,status").order("created_at", { ascending: false }).limit(5)

  return (
    <>
      <h1>Overview</h1>
      <p className="lead">Everything on the site is edited from here.</p>
      <div className="stats">
        <Link className="stat" href="/admin/leads"><b>{newLeads}</b><span>NEW LEADS (of {leads})</span></Link>
        <Link className="stat" href="/admin/projects"><b>{projects}</b><span>PROJECTS ({drafts} drafts)</span></Link>
        <Link className="stat" href="/admin/blogs"><b>{blogs}</b><span>BLOG POSTS</span></Link>
      </div>
      <h2 className="lbl2" style={{ fontSize: 12 }}>LATEST LEADS</h2>
      {recent && recent.length > 0 ? (
        <table className="tbl">
          <tbody>
            {recent.map((l) => (
              <tr key={l.id}>
                <td className="t">{l.name}</td>
                <td style={{ maxWidth: 420 }}>{(l.message ?? "").slice(0, 120)}</td>
                <td><span className={`chip ${l.status}`}>{l.status}</span></td>
                <td className="sub">{new Date(l.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="lead">No leads yet.</p>
      )}
    </>
  )
}
