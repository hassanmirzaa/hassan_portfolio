import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Session-aware client for server components and actions.
// Uses the logged-in user's JWT, so Row Level Security (is_admin()) decides what is allowed.
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a server component: the proxy refreshes the session instead.
        }
      },
    },
  })
}
