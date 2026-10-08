import { ImageResponse } from "next/og"

export const alt = "Hassan Mirza · Full stack mobile engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#F3EDE0", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, color: "#14110D" }}>
        <div style={{ fontSize: 34, color: "#6B1F2A", display: "flex" }}>Hassan Mirza · Full stack mobile engineer</div>
        <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, display: "flex", flexDirection: "column" }}>
          <span>I build the app,</span>
          <span>the API, and the</span>
          <span style={{ color: "#B8893B" }}>App Store release.</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28 }}>
          {["Flutter", "Laravel", "Node.js", "Supabase"].map((t) => (
            <span key={t} style={{ border: "3px solid #14110D", borderRadius: 99, padding: "8px 22px" }}>{t}</span>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
