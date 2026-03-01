import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, source, call_date, call_time } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase.from("portfolio_leads").insert({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      message: message?.trim() || null,
      source: source || "contact_form",
      call_date: call_date || null,
      call_time: call_time || null,
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to save lead" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: "Lead saved successfully" })
  } catch (error) {
    console.error("Leads API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
