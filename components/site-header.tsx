import Link from "next/link"
import type { SiteSettings } from "@/lib/settings"

export default function SiteHeader({ settings, home = false }: { settings: SiteSettings; home?: boolean }) {
  const base = home ? "" : "/"
  return (
    <header className="site-header">
      <Link className="mark" href="/">
        Hassan <i>Mirza</i>
      </Link>
      <nav className="site-nav" aria-label="Main">
        <Link href={`${base}#work`}>Apps</Link>
        <Link href={`${base}#process`}>Process</Link>
        <Link href={`${base}#about`}>About</Link>
        <Link href={`${base}#contact`}>Contact</Link>
      </nav>
      <div className={`pill${settings.isAvailable ? "" : " off"}`} role="status">
        <b aria-hidden="true" />
        <span>
          {settings.isAvailable
            ? settings.availableFrom
              ? `Online · free from ${settings.availableFrom}`
              : "Online now"
            : "Fully booked"}
        </span>
      </div>
    </header>
  )
}
