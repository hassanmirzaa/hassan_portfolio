import { requireAdmin } from "@/lib/admin"

const cell = (v: unknown) => {
  const s = String(v ?? "")
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("portfolio_leads").select("*").order("created_at", { ascending: false })
  const cols = ["created_at", "name", "email", "phone", "project_type", "source", "status", "message", "call_date", "call_time", "notes"]
  const csv = [cols.join(","), ...(data ?? []).map((r) => cols.map((c) => cell((r as Record<string, unknown>)[c])).join(","))].join("\n")
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
