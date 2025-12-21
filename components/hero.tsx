"use client"

export default function Hero() {

  return (
    <section id="home" className="relative flex items-center justify-start px-4 pt-12 pb-12">
      <div className="max-w-6xl mx-auto text-left animate-blur-in">
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-in-left" style={{ fontFamily: "var(--font-poppins), var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-shift">
              Let's launch pixel perfect mobile apps
            </span>
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground/90">
            in <span className="line-through text-foreground/40">months</span>{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">
              just days
            </span>
          </h2>
        </div>
      </div>
    </section>
  )
}
