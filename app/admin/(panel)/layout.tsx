import Link from "next/link"
import AdminNav from "@/components/admin/nav"
import BottomNav from "@/components/admin/bottom-nav"
import { requireAdmin } from "@/lib/admin"
import { logout } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await requireAdmin()
  const { count } = await supabase.from("portfolio_leads").select("*", { count: "exact", head: true }).eq("status", "new")
  const newLeads = count ?? 0
  return (
    <div className="adm">
      {/* Desktop sidebar */}
      <aside className="adm-side">
        <Link className="mark" href="/admin">
          Hassan <i>Mirza</i>
        </Link>
        <AdminNav newLeads={newLeads} />
        <Link className="nav" href="/" target="_blank">
          View site ↗
        </Link>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </aside>

      {/* Phone header: logo + a menu for the less-used links */}
      <header className="adm-mtop">
        <Link className="mark" href="/admin">
          Hassan <i>Mirza</i>
        </Link>
        <details className="adm-menu">
          <summary aria-label="Menu">⋯</summary>
          <div>
            <Link href="/" target="_blank">View site ↗</Link>
            <Link href="/admin/account">Account and password</Link>
            <form action={logout}>
              <button type="submit">Sign out</button>
            </form>
          </div>
        </details>
      </header>

      <main className="adm-main" id="main">
        {children}
      </main>

      <BottomNav newLeads={newLeads} />
    </div>
  )
}
