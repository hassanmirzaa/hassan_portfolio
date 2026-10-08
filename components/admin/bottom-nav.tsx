"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  ["/admin", "Home", "◧"],
  ["/admin/projects", "Projects", "▣"],
  ["/admin/leads", "Leads", "✉"],
  ["/admin/blogs", "Posts", "✎"],
  ["/admin/settings", "Site", "⚙"],
]

// Thumb-reach tab bar, shown on phones only (CSS).
export default function BottomNav({ newLeads = 0 }: { newLeads?: number }) {
  const path = usePathname()
  return (
    <nav className="adm-bottom" aria-label="Admin sections">
      {ITEMS.map(([href, label, icon]) => {
        const on = href === "/admin" ? path === href : path.startsWith(href)
        return (
          <Link key={href} href={href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
            <span className="ico" aria-hidden="true">
              {icon}
              {href === "/admin/leads" && newLeads > 0 && <i className="dot">{newLeads > 9 ? "9+" : newLeads}</i>}
            </span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
