import { createBrowserClient } from "@supabase/ssr"

// Browser client: runs as the logged-in admin (session cookie), so Row Level Security still applies.
// Used for uploading screenshots straight to Storage without sending big files through the server.
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "")
}
