"use client"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"" | "success" | "error">("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "contact_form" }),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/hassan-mirza-" },
    { name: "GitHub", url: "https://github.com/hassanmirzaa" },
    { name: "Upwork", url: "https://www.upwork.com/freelancers/~01667255a108dfd384?mp_source=share" },
  ]

  return (
    <section id="contact" className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Get In Touch</span>
        </h2>
        <p className="text-center text-foreground/60 mb-12">
          Have a project in mind? Let&apos;s create something amazing together.
        </p>

        <div className="glass-effect p-8 rounded-lg border border-primary/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mobile Number <span className="text-foreground/40 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                rows={6}
                className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors resize-none disabled:opacity-50"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-interactive w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-green-400 text-center text-sm">Thank you! Your message has been sent. I&apos;ll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-center text-sm">Failed to send message. Please try again.</p>
            )}
          </form>

          <div className="mt-12 pt-8 border-t border-primary/20 space-y-4 text-center">
            <p className="text-foreground/70">Connect with me on social media</p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary transition-colors duration-300 font-medium"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
