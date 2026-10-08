import { requireAdmin } from "@/lib/admin"
import { LeadRow, type LeadData } from "@/components/admin/forms"

export default async function LeadsAdmin() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("portfolio_leads").select("*").order("created_at", { ascending: false }).limit(300)
  const leads = (data ?? []) as LeadData[]
  return (
    <>
      <h1>Leads</h1>
      <p className="lead">Messages from the contact form and the chatbot. Newest first.</p>
      {leads.length === 0 ? (
        <p className="lead">Nothing yet.</p>
      ) : (
        <table className="tbl">
          <thead><tr><th>WHO</th><th>CONTACT</th><th>MESSAGE</th><th>FOLLOW-UP</th></tr></thead>
          <tbody>{leads.map((l) => <LeadRow key={l.id} l={{ ...l, status: l.status ?? "new" }} />)}</tbody>
        </table>
      )}
    </>
  )
}
