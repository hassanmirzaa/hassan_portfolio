import { supabase } from "@/lib/supabase"

export type SiteSettings = {
  email: string
  github: string | null
  linkedin: string | null
  instagram: string | null
  upwork: string | null
  isAvailable: boolean
  availableFrom: string | null
}

export const fallbackSettings: SiteSettings = {
  email: "hassanmirza0801@gmail.com",
  github: "https://github.com/hassanmirzaa",
  linkedin: "https://www.linkedin.com/in/hassan-mirza-",
  instagram: null,
  upwork: "https://www.upwork.com/freelancers/~01667255a108dfd384?mp_source=share",
  isAvailable: true,
  availableFrom: null,
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single()
    if (error || !data) return fallbackSettings
    const r = data as Record<string, unknown>
    return {
      email: (r.contact_email as string) || fallbackSettings.email,
      github: (r.github_url as string) || fallbackSettings.github,
      linkedin: (r.linkedin_url as string) || fallbackSettings.linkedin,
      instagram: (r.instagram_url as string) || null,
      upwork: (r.upwork_url as string) || fallbackSettings.upwork,
      isAvailable: r.is_available !== false,
      availableFrom: (r.available_from as string) || null,
    }
  } catch {
    return fallbackSettings
  }
}
