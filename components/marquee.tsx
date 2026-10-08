const WORDS = ["Flutter", "Dart", "Laravel", "Node.js", "Firebase", "Supabase", "MySQL", "PostgreSQL", "Riverpod", "OpenAI", "Stripe", "Google Ads", "App Store", "Play Store"]

export default function Marquee() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="track">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}
