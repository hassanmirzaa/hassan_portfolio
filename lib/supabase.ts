import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const emptyResult = { data: null, error: { message: "Supabase not configured" } }
const emptyPromise = Promise.resolve(emptyResult)

// Chainable stand-in so pages still render (from fallback data) when env vars are missing.
const mockChain: Record<string, unknown> = {}
for (const m of ["select", "eq", "order", "limit", "insert", "update", "delete"]) {
  mockChain[m] = () => mockChain
}
mockChain.single = () => emptyPromise
mockChain.maybeSingle = () => emptyPromise
mockChain.then = (resolve: (v: typeof emptyResult) => unknown) => resolve(emptyResult)

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({ from: () => mockChain } as unknown as SupabaseClient)
