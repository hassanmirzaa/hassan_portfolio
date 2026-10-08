import { LoginForm } from "@/components/admin/forms"

const NOTES: Record<string, string> = {
  forbidden: "That account isn't an admin.",
  config: "Supabase isn't configured on this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams
  return (
    <div className="login">
      <LoginForm note={e ? NOTES[e] : undefined} />
    </div>
  )
}
