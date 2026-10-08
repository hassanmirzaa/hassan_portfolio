import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const SOURCES = new Set(["contact_form", "chatbot", "website"])
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const clean = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null)

async function notify(lead: Record<string, string | null>) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: process.env.LEAD_NOTIFY_EMAIL ?? "hassanmirza0801@gmail.com",
        reply_to: lead.email ?? undefined,
        subject: `New ${lead.source === "chatbot" ? "chat booking" : "message"} from ${lead.name}`,
        html: `<div style="font-family:Arial,sans-serif;padding:16px">
          <h2>New lead</h2>
          <p><b>Name:</b> ${esc(lead.name ?? "")}</p>
          <p><b>Email:</b> ${esc(lead.email ?? "-")}</p>
          <p><b>Needs:</b> ${esc(lead.project_type ?? "-")}</p>
          <p><b>Source:</b> ${esc(lead.source ?? "")}</p>
          ${lead.call_date ? `<p><b>Call:</b> ${esc(lead.call_date)} ${esc(lead.call_time ?? "")}</p>` : ""}
          <p><b>Message:</b></p><p style="white-space:pre-wrap">${esc(lead.message ?? "-")}</p></div>`,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (limited(ip)) return NextResponse.json({ success: false, message: "Too many messages. Try again in a minute." }, { status: 429 })

    const body = await request.json()
    // Honeypot: bots fill this hidden field. Pretend it worked.
    if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ success: true })

    const name = clean(body.name, 200)
    if (!name) return NextResponse.json({ success: false, message: "Please add your name." }, { status: 400 })

    const email = clean(body.email, 320)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ success: false, message: "That email doesn't look right." }, { status: 400 })

    const lead = {
      name,
      email,
      phone: clean(body.phone, 50),
      message: clean(body.message, 5000),
      project_type: clean(body.project_type, 100),
      source: SOURCES.has(body.source) ? (body.source as string) : "website",
      call_date: clean(body.call_date, 100),
      call_time: clean(body.call_time, 100),
    }

    // Save first. A failed email must never lose the lead.
    let { error } = await supabase.from("portfolio_leads").insert(lead)
    if (error && /project_type/.test(error.message ?? "")) {
      // Migration 001 not applied yet: retry without the new column.
      const { project_type: _omit, ...legacy } = lead
      ;({ error } = await supabase.from("portfolio_leads").insert(legacy))
    }
    const saved = !error
    if (error) console.error("Lead insert failed:", error.message)

    const emailed = await notify(lead)
    if (!saved && !emailed) return NextResponse.json({ success: false, message: "Couldn't send that. Please email me directly." }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Leads API error:", e)
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 })
  }
}
