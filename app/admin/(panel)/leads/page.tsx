import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import { LeadRow, type LeadData } from "@/components/admin/forms"

const STATUSES = ["new", "contacted", "won", "lost"]

export default async function LeadsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams
  const { supabase } = await requireAdmin()
  let query = supabase.from("portfolio_leads").select("*").order("created_at", { ascending: false }).limit(300)
  if (status && STATUSES.includes(status)) query = query.eq("status", status)
  if (q) {
    const safe = q.replace(/[%,()]/g, " ").trim()
    if (safe) query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,message.ilike.%${safe}%`)
  }
  const { data } = await query
  const leads = (data ?? []) as LeadData[]
  const href = (s?: string) => `/admin/leads${s ? `?status=${s}` : ""}`
  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Leads</h1>
          <p className="lead">Messages from the contact form and the chatbot. Newest first.</p>
        </div>
        <a className="b" href="/admin/leads/export">Download CSV</a>
      </div>
      <div className="filters">
        <Link href={href()} className={!status ? "on" : ""}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={href(s)} className={status === s ? "on" : ""}>{s[0].toUpperCase() + s.slice(1)}</Link>
        ))}
        <form action="/admin/leads">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, email, message" aria-label="Search leads" />
        </form>
      </div>
      {leads.length === 0 ? (
        <p className="lead">Nothing here.</p>
      ) : (
        <table className="tbl stack">
          <thead><tr><th>WHO</th><th>CONTACT</th><th>MESSAGE</th><th>FOLLOW-UP</th></tr></thead>
          <tbody>{leads.map((l) => <LeadRow key={l.id} l={{ ...l, status: l.status ?? "new" }} />)}</tbody>
        </table>
      )}
    </>
  )
}
