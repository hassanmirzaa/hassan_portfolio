const STEPS = [
  { n: "01", t: "Scope", p: "We agree what ships first. Screens, data and the one flow that has to feel great.", s: "BRIEF · FLOWS" },
  { n: "02", t: "The app", p: "A Flutter app with clean architecture that runs the same on iOS and Android.", s: "FLUTTER · RIVERPOD · BLOC" },
  { n: "03", t: "The backend", p: "APIs, auth, database, admin panel and real-time pieces, in Laravel or Node.", s: "LARAVEL · NODE · FIREBASE" },
  { n: "04", t: "Ship", p: "Store listings, release builds and a calm launch, then support after it's live.", s: "APP STORE · PLAY STORE" },
]

export default function Process() {
  return (
    <section className="s dk" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="head rv">
          <div>
            <div className="eyebrow">How I work</div>
            <h2 className="h2" id="process-title">
              From first sketch
              <br />
              to <em>store listing.</em>
            </h2>
          </div>
          <p>
            No hand-offs between a designer, an app team and a backend team. One person owns the whole path, so nothing
            gets lost.
          </p>
        </div>
        <div className="route rv" aria-hidden="true">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none">
            <path d="M10 40 C 150 5, 230 55, 380 30 S 600 5, 700 32 S 900 55, 990 22" />
          </svg>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className={`step rv${i ? ` d${i}` : ""}`} key={s.n}>
              <div className="no">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
              <small>{s.s}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
