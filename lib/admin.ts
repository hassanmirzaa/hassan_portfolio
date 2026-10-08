import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase"

// Real authorization check. The proxy only does an optimistic redirect; this is the gate.
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login?e=config")
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/admin/login")
  const { data: ok } = await supabase.rpc("is_admin")
  if (ok !== true) {
    await supabase.auth.signOut()
    redirect("/admin/login?e=forbidden")
  }
  return { supabase, user: data.user }
}
