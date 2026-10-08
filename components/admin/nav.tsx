"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  ["/admin", "Overview"],
  ["/admin/projects", "Projects"],
  ["/admin/blogs", "Blog posts"],
  ["/admin/leads", "Leads"],
  ["/admin/settings", "Site settings"],
]

export default function AdminNav() {
  const path = usePathname()
  return (
    <>
      {ITEMS.map(([href, label]) => {
        const on = href === "/admin" ? path === href : path.startsWith(href)
        return (
          <Link key={href} href={href} className={`nav${on ? " on" : ""}`} aria-current={on ? "page" : undefined}>
            {label}
          </Link>
        )
      })}
    </>
  )
}
