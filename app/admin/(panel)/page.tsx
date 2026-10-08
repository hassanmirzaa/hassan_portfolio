import Link from "next/link"
import { requireAdmin } from "@/lib/admin"

type Check = { ok: boolean | "warn"; title: string; hint?: string }

export default async function Overview() {
  const { supabase } = await requireAdmin()
  const count = async (table: string, f?: (q: any) => any) => {
    const q = supabase.from(table).select("*", { count: "exact", head: true })
    const { count: c } = await (f ? f(q) : q)
    return c ?? 0
  }
  const [projects, published, blogs, newLeads, leads] = await Promise.all([
    count("projects"),
    count("projects", (q) => q.eq("is_published", true)),
    count("blogs"),
    count("portfolio_leads", (q) => q.eq("status", "new")),
    count("portfolio_leads"),
  ])
  const { data: recent } = await supabase.from("portfolio_leads").select("id,name,message,created_at,status").order("created_at", { ascending: false }).limit(5)

  // Setup checks: the things that silently break the site when missing.
  const cols = await supabase.from("projects").select("client,platforms,features,highlights,screens").limit(1)
  const { data: settings } = await supabase.from("site_settings").select("id").eq("id", 1).maybeSingle()
  const thin = await supabase.from("projects").select("title,screens,features").eq("is_published", true)
  const thinList = (thin.data ?? []).filter((p) => (p.screens?.length ?? 0) < 3 || (p.features?.length ?? 0) < 5).map((p) => p.title)
  const checks: Check[] = [
    { ok: !cols.error, title: "Database has the project detail columns", hint: cols.error ? "Run supabase/10_project_details.sql in the SQL editor." : undefined },
    { ok: Boolean(settings), title: "Site settings row exists", hint: settings ? undefined : "Run supabase/02_tables.sql." },
    { ok: published > 0, title: "At least one project is published", hint: published ? undefined : "Open Projects and tick Published." },
    { ok: thinList.length === 0 ? true : "warn", title: "Published projects have 3+ screens and 5+ features", hint: thinList.length ? `Thin: ${thinList.join(", ")}` : undefined },
    { ok: process.env.RESEND_API_KEY ? true : "warn", title: "Lead notification emails (RESEND_API_KEY)", hint: process.env.RESEND_API_KEY ? undefined : "Not set: leads are saved but you won't get an email." },
    { ok: process.env.GEMINI_API_KEY ? true : "warn", title: "Chatbot (GEMINI_API_KEY)", hint: process.env.GEMINI_API_KEY ? undefined : "Not set: the chatbot will reply with an error." },
    { ok: process.env.NEXT_PUBLIC_SITE_URL ? true : "warn", title: "Site URL for sitemap and sharing (NEXT_PUBLIC_SITE_URL)", hint: process.env.NEXT_PUBLIC_SITE_URL ? undefined : "Not set: defaults to hassanmirzaa.com." },
  ]

  return (
    <>
      <h1>Overview</h1>
      <p className="lead">Everything on the site is edited from here.</p>
      <div className="stats">
        <Link className="stat" href="/admin/leads?status=new"><b>{newLeads}</b><span>NEW LEADS (of {leads})</span></Link>
        <Link className="stat" href="/admin/projects"><b>{published}</b><span>PUBLISHED PROJECTS (of {projects})</span></Link>
        <Link className="stat" href="/admin/blogs"><b>{blogs}</b><span>BLOG POSTS</span></Link>
      </div>

      <h2 className="lbl2" style={{ fontSize: 12 }}>SETUP CHECKS</h2>
      <ul className="check-list" style={{ marginBottom: 34 }}>
        {checks.map((c) => (
          <li key={c.title} className={c.ok === true ? "ok" : c.ok === "warn" ? "warn" : "bad"}>
            <span className="ic" aria-hidden="true">{c.ok === true ? "✓" : c.ok === "warn" ? "!" : "✕"}</span>
            <div>
              {c.title}
              {c.hint && <small>{c.hint}</small>}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="lbl2" style={{ fontSize: 12 }}>LATEST LEADS</h2>
      {recent && recent.length > 0 ? (
        <table className="tbl stack">
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
