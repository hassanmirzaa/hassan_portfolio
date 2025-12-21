import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-poppins" })

export const metadata: Metadata = {
  title: "Hassan Mirza - Flutter Mobile Developer",
  description:
    "Flutter mobile developer specializing in cross-platform iOS and Android applications. Building production-ready apps with Flutter, Firebase, and modern mobile architectures.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${inter.variable} ${poppins.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
