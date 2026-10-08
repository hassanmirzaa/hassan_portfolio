const COLS = [
  { t: "Mobile", i: ["Flutter", "Dart", "Riverpod", "Bloc"] },
  { t: "Backend", i: ["Laravel", "Node.js", "Express", "REST APIs"] },
  { t: "Data", i: ["MySQL", "PostgreSQL", "Firebase", "Supabase"] },
  { t: "Release and revenue", i: ["App Store", "Play Store", "Google Ads", "Stripe"] },
]

export default function Stack() {
  return (
    <section className="s" id="stack" style={{ paddingTop: 0 }} aria-labelledby="stack-title">
      <div className="wrap">
        <div className="head rv">
          <div>
            <div className="eyebrow">Toolbox</div>
            <h2 className="h2" id="stack-title">
              What I <em>reach for.</em>
            </h2>
          </div>
        </div>
        <div className="cols">
          {COLS.map((c, i) => (
            <div className={`col rv${i ? ` d${i}` : ""}`} key={c.t}>
              <h3>{c.t}</h3>
              <ul>
                {c.i.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
