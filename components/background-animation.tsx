"use client"

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[#1a1f3a] to-background" />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0, 217, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
