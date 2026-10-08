"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  ["/admin", "Overview"],
  ["/admin/projects", "Projects"],
  ["/admin/leads", "Leads"],
  ["/admin/blogs", "Blog posts"],
  ["/admin/settings", "Site settings"],
  ["/admin/account", "Account"],
]

export default function AdminNav({ newLeads = 0 }: { newLeads?: number }) {
  const path = usePathname()
  return (
    <>
      {ITEMS.map(([href, label]) => {
        const on = href === "/admin" ? path === href : path.startsWith(href)
        return (
          <Link key={href} href={href} className={`nav${on ? " on" : ""}`} aria-current={on ? "page" : undefined}>
            {label}
            {href === "/admin/leads" && newLeads > 0 && <span className="badge" aria-label={`${newLeads} new`}>{newLeads}</span>}
          </Link>
        )
      })}
    </>
  )
}
