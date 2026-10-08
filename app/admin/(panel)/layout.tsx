import Link from "next/link"
import AdminNav from "@/components/admin/nav"
import { requireAdmin } from "@/lib/admin"
import { logout } from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="adm">
      <aside className="adm-side">
        <Link className="mark" href="/admin">
          Hassan <i>Mirza</i>
        </Link>
        <AdminNav />
        <Link className="nav" href="/" target="_blank">
          View site ↗
        </Link>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <main className="adm-main" id="main">
        {children}
      </main>
    </div>
  )
}
