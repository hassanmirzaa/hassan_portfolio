import type React from "react"
import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Instrument_Sans, Caveat, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Cursor from "@/components/cursor"
import ScrollReveal from "@/components/scroll-reveal"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"], display: "swap" })
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" })
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

const description =
  "Hassan Mirza is a full stack mobile engineer in Karachi. Flutter apps for iOS and Android with Laravel or Node.js backends, built and shipped end to end."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Hassan Mirza · Full stack mobile engineer", template: "%s · Hassan Mirza" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hassan Mirza",
    title: "Hassan Mirza · Full stack mobile engineer",
    description,
  },
  twitter: { card: "summary_large_image", title: "Hassan Mirza · Full stack mobile engineer", description },
}

export const viewport: Viewport = { themeColor: "#F3EDE0" }

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hassan Mirza",
  jobTitle: "Full stack mobile engineer",
  url: SITE_URL,
  email: "mailto:hassanmirza0801@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
  sameAs: ["https://github.com/hassanmirzaa", "https://www.linkedin.com/in/hassan-mirza-"],
  knowsAbout: ["Flutter", "Dart", "Laravel", "Node.js", "Firebase", "Supabase", "iOS", "Android"],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${hand.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <Cursor />
        <ScrollReveal />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  )
}
