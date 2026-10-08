"use client"

import { useState } from "react"
import type { SiteSettings } from "@/lib/settings"

type Status = "idle" | "sending" | "done" | "error"

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          project_type: fd.get("project_type"),
          message: fd.get("message"),
          website: fd.get("website"),
          source: "contact_form",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || "Something went wrong")
      form.reset()
      setStatus("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStatus("error")
    }
  }

  const socials = [
    ["LinkedIn", settings.linkedin],
    ["GitHub", settings.github],
    ["Upwork", settings.upwork],
    ["Instagram", settings.instagram],
  ].filter((s): s is [string, string] => Boolean(s[1]))

  const [user, domain] = settings.email.split("@")

  return (
    <section className="s contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="eyebrow" id="contact-title">
          Let&apos;s talk
        </div>
        <a className="mail" href={`mailto:${settings.email}`}>
          {user}
          <span>@</span>
          {domain}
        </a>

        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="c-name">Your name</label>
            <input id="c-name" name="name" required maxLength={200} autoComplete="name" placeholder="Ayesha Khan" />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" required maxLength={320} autoComplete="email" placeholder="you@company.com" />
          </div>
          <div className="field full">
            <label htmlFor="c-type">What do you need?</label>
            <select id="c-type" name="project_type" defaultValue="Mobile app">
              <option>Mobile app</option>
              <option>Backend or API</option>
              <option>Admin panel or dashboard</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="c-msg">Tell me about it</label>
            <textarea id="c-msg" name="message" required maxLength={5000} placeholder="What are you building, and by when?" />
          </div>
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="full" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn solid" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"} <span className="ar">→</span>
            </button>
            <span className="form-msg" role="status" aria-live="polite">
              {status === "done" && "Thanks. I'll reply within a day."}
              {status === "error" && error}
            </span>
          </div>
        </form>

        <div className="foot">
          <div>
            {socials.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ))}
          </div>
          <div>Karachi · © {new Date().getFullYear()} Hassan Mirza</div>
        </div>
      </div>
    </section>
  )
}
