import Link from "next/link"

export default function NotFound() {
  return (
    <main id="main" className="wrap page-top" style={{ minHeight: "70vh" }}>
      <p className="eyebrow">404</p>
      <h1 className="case-title">That page took a wrong turn.</h1>
      <p className="case-sum">It may have moved, or it never existed.</p>
      <p style={{ marginTop: 34 }}>
        <Link className="btn solid" href="/">
          Back home <span className="ar">→</span>
        </Link>
      </p>
    </main>
  )
}
