import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

const emptyResult = { data: null, error: { message: "Supabase not configured" } }
const emptyPromise = Promise.resolve(emptyResult)

const mockChain = {
  select: () => mockChain,
  eq: () => mockChain,
  order: () => emptyPromise,
  single: () => emptyPromise,
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : ({ from: () => mockChain } as unknown as SupabaseClient)
