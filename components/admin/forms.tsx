"use client"

import { useActionState, useState, useTransition } from "react"
import { login, saveProject, saveBlog, saveSettings, updateLead, deleteLead, deleteProject, deleteBlog, togglePublish, type ActionState } from "@/app/admin/actions"
import type { SiteSettings } from "@/lib/settings"

function Msg({ s }: { s: ActionState }) {
  if (!s) return null
  if (s.error) return <div className="msg-err" role="alert">{s.error}</div>
  if (s.ok) return <div className="msg-ok" role="status">Saved.</div>
  return null
}

export function LoginForm({ note }: { note?: string }) {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <form action={action}>
      <h1>Admin</h1>
      {note && <div className="msg-err" role="alert">{note}</div>}
      <Msg s={state} />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="b solid" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  )
}

export type ProjectData = {
  id?: string
  title?: string
  slug?: string
  summary?: string | null
  description?: string
  role?: string | null
  problem?: string | null
  approach?: string | null
  outcome?: string | null
  tech_stack?: string[]
  year?: string | null
  status?: string
  category?: string | null
  metrics?: string | null
  accent_color?: string
  cover_image?: string | null
  screens?: { url: string; caption?: string }[]
  play_store_url?: string | null
  app_store_url?: string | null
  github_url?: string | null
  live_url?: string | null
  demo_video?: string | null
  is_confidential?: boolean
  is_featured?: boolean
  is_published?: boolean
  sort_order?: number
}

export function ProjectForm({ p }: { p: ProjectData }) {
  const [state, action, pending] = useActionState(saveProject.bind(null, p.id ?? null), undefined)
  const [color, setColor] = useState(p.accent_color ?? "#17403A")
  return (
    <form className="af" action={action}>
      <Msg s={state} />
      <div className="two">
        <div><label htmlFor="title">Title</label><input id="title" name="title" type="text" defaultValue={p.title} required /></div>
        <div><label htmlFor="slug">Slug (URL)</label><input id="slug" name="slug" type="text" defaultValue={p.slug} placeholder="auto from title" /></div>
      </div>
      <div>
        <label htmlFor="summary">One-line summary (shown in the work list)</label>
        <input id="summary" name="summary" type="text" maxLength={160} defaultValue={p.summary ?? ""} />
      </div>
      <div>
        <label htmlFor="description">About this app</label>
        <textarea id="description" name="description" defaultValue={p.description} required />
      </div>
      <fieldset>
        <legend>CASE STUDY (optional, leave blank to hide a section)</legend>
        <div><label htmlFor="role">Your role</label><input id="role" name="role" type="text" defaultValue={p.role ?? ""} placeholder="Flutter app and Laravel API" /></div>
        <div><label htmlFor="problem">The brief</label><textarea id="problem" name="problem" defaultValue={p.problem ?? ""} /></div>
        <div><label htmlFor="approach">The build (decisions and tradeoffs)</label><textarea id="approach" name="approach" defaultValue={p.approach ?? ""} /></div>
        <div><label htmlFor="outcome">The result (real numbers only)</label><textarea id="outcome" name="outcome" defaultValue={p.outcome ?? ""} /></div>
      </fieldset>
      <div>
        <label htmlFor="tech_stack">Tech stack (comma separated)</label>
        <input id="tech_stack" name="tech_stack" type="text" defaultValue={(p.tech_stack ?? []).join(", ")} placeholder="Flutter, Laravel, Firebase" />
      </div>
      <div className="three">
        <div><label htmlFor="year">Year</label><input id="year" name="year" type="text" defaultValue={p.year ?? ""} /></div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={p.status ?? "live"}>
            <option value="live">Live</option><option value="in_development">In development</option><option value="archived">Archived</option>
          </select>
        </div>
        <div><label htmlFor="sort_order">Order (0 = first)</label><input id="sort_order" name="sort_order" type="number" min={0} max={999} defaultValue={p.sort_order ?? 0} /></div>
      </div>
      <div className="two">
        <div><label htmlFor="category">Category</label><input id="category" name="category" type="text" defaultValue={p.category ?? "Mobile App"} /></div>
        <div>
          <label htmlFor="accent_color">Hover card colour</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Pick colour" />
            <input id="accent_color" name="accent_color" type="text" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
        </div>
      </div>
      <fieldset>
        <legend>IMAGES</legend>
        <div>
          <label htmlFor="cover_image">Cover screenshot URL</label>
          <input id="cover_image" name="cover_image" type="text" defaultValue={p.cover_image ?? ""} placeholder="or upload below" />
          <div className="hint">Portrait phone screenshot works best. A file below replaces this URL.</div>
          {p.cover_image && <div className="thumbs" style={{ marginTop: 10 }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img className="thumb" src={p.cover_image} alt="" /></div>}
        </div>
        <div><label htmlFor="cover_file">Upload cover</label><input id="cover_file" name="cover_file" type="file" accept="image/png,image/jpeg,image/webp,image/avif" /></div>
        <div>
          <label htmlFor="screens">Screens, one per line: URL | caption</label>
          <textarea id="screens" name="screens" defaultValue={(p.screens ?? []).map((s) => (s.caption ? `${s.url} | ${s.caption}` : s.url)).join("\n")} />
        </div>
        <div><label htmlFor="screen_files">Upload more screens (added to the list)</label><input id="screen_files" name="screen_files" type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif" /></div>
      </fieldset>
      <fieldset>
        <legend>LINKS</legend>
        <div className="two">
          <div><label htmlFor="play_store_url">Google Play</label><input id="play_store_url" name="play_store_url" type="url" defaultValue={p.play_store_url ?? ""} /></div>
          <div><label htmlFor="app_store_url">App Store</label><input id="app_store_url" name="app_store_url" type="url" defaultValue={p.app_store_url ?? ""} /></div>
          <div><label htmlFor="live_url">Live site</label><input id="live_url" name="live_url" type="url" defaultValue={p.live_url ?? ""} /></div>
          <div><label htmlFor="github_url">GitHub</label><input id="github_url" name="github_url" type="url" defaultValue={p.github_url ?? ""} /></div>
        </div>
        <div><label htmlFor="demo_video">Demo video URL</label><input id="demo_video" name="demo_video" type="url" defaultValue={p.demo_video ?? ""} /></div>
        <div><label htmlFor="metrics">Metric (e.g. downloads). Leave empty unless it is a real number.</label><input id="metrics" name="metrics" type="text" defaultValue={p.metrics ?? ""} /></div>
      </fieldset>
      <div className="checks">
        <label><input type="checkbox" name="is_published" defaultChecked={p.is_published ?? false} /> Published</label>
        <label><input type="checkbox" name="is_featured" defaultChecked={p.is_featured ?? true} /> Featured</label>
        <label><input type="checkbox" name="is_confidential" defaultChecked={p.is_confidential ?? false} /> Confidential (screens must be anonymised)</label>
      </div>
      <div className="row-actions">
        <button className="b solid" disabled={pending}>{pending ? "Saving…" : "Save project"}</button>
        <a className="b" href="/admin/projects">Cancel</a>
      </div>
    </form>
  )
}

export type BlogData = { id?: string; title?: string; slug?: string; content?: string; excerpt?: string | null; category?: string | null; author?: string | null; tags?: string[] | null; sort_order?: number; is_published?: boolean }

export function BlogForm({ b }: { b: BlogData }) {
  const [state, action, pending] = useActionState(saveBlog.bind(null, b.id ?? null), undefined)
  return (
    <form className="af" action={action}>
      <Msg s={state} />
      <div className="two">
        <div><label htmlFor="title">Title</label><input id="title" name="title" type="text" defaultValue={b.title} required /></div>
        <div><label htmlFor="slug">Slug (URL)</label><input id="slug" name="slug" type="text" defaultValue={b.slug} placeholder="auto from title" /></div>
      </div>
      <div><label htmlFor="excerpt">Excerpt (shown on cards)</label><input id="excerpt" name="excerpt" type="text" maxLength={300} defaultValue={b.excerpt ?? ""} /></div>
      <div><label htmlFor="content">Content (blank line = new paragraph)</label><textarea id="content" name="content" style={{ minHeight: 320 }} defaultValue={b.content} required /></div>
      <div className="three">
        <div><label htmlFor="category">Category</label><input id="category" name="category" type="text" defaultValue={b.category ?? "General"} /></div>
        <div><label htmlFor="author">Author</label><input id="author" name="author" type="text" defaultValue={b.author ?? "Hassan Mirza"} /></div>
        <div><label htmlFor="sort_order">Order</label><input id="sort_order" name="sort_order" type="number" min={0} max={999} defaultValue={b.sort_order ?? 0} /></div>
      </div>
      <div><label htmlFor="tags">Tags (comma separated)</label><input id="tags" name="tags" type="text" defaultValue={(b.tags ?? []).join(", ")} /></div>
      <div className="checks"><label><input type="checkbox" name="is_published" defaultChecked={b.is_published ?? false} /> Published</label></div>
      <div className="row-actions">
        <button className="b solid" disabled={pending}>{pending ? "Saving…" : "Save post"}</button>
        <a className="b" href="/admin/blogs">Cancel</a>
      </div>
    </form>
  )
}

export function SettingsForm({ s }: { s: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined)
  return (
    <form className="af" action={action}>
      <Msg s={state} />
      <div><label htmlFor="contact_email">Contact email (shown on the site)</label><input id="contact_email" name="contact_email" type="email" defaultValue={s.email} required /></div>
      <div className="two">
        <div><label htmlFor="linkedin_url">LinkedIn</label><input id="linkedin_url" name="linkedin_url" type="url" defaultValue={s.linkedin ?? ""} /></div>
        <div><label htmlFor="github_url">GitHub</label><input id="github_url" name="github_url" type="url" defaultValue={s.github ?? ""} /></div>
        <div><label htmlFor="upwork_url">Upwork</label><input id="upwork_url" name="upwork_url" type="url" defaultValue={s.upwork ?? ""} /></div>
        <div><label htmlFor="instagram_url">Instagram</label><input id="instagram_url" name="instagram_url" type="url" defaultValue={s.instagram ?? ""} /></div>
      </div>
      <div className="two">
        <div><label htmlFor="available_from">Free from (optional, e.g. November 2026. Header then reads: Online, free from November 2026)</label><input id="available_from" name="available_from" type="text" defaultValue={s.availableFrom ?? ""} /></div>
        <div className="checks" style={{ alignItems: "end" }}><label><input type="checkbox" name="is_available" defaultChecked={s.isAvailable} /> Online and open to new projects (untick to show Fully booked)</label></div>
      </div>
      <div className="row-actions"><button className="b solid" disabled={pending}>{pending ? "Saving…" : "Save settings"}</button></div>
    </form>
  )
}

export function ConfirmDelete({ label, onConfirm }: { label: string; onConfirm: () => Promise<void> }) {
  const [pending, start] = useTransition()
  return (
    <button className="b sm danger" disabled={pending} onClick={() => confirm(`Delete "${label}"? This can't be undone.`) && start(onConfirm)}>
      {pending ? "…" : "Delete"}
    </button>
  )
}

export const DeleteProject = ({ id, title }: { id: string; title: string }) => <ConfirmDelete label={title} onConfirm={() => deleteProject(id)} />
export const DeleteBlog = ({ id, title }: { id: string; title: string }) => <ConfirmDelete label={title} onConfirm={() => deleteBlog(id)} />

export function PublishToggle({ table, id, on }: { table: "projects" | "blogs"; id: string; on: boolean }) {
  const [pending, start] = useTransition()
  return (
    <button className={`chip${on ? "" : " off"}`} style={{ cursor: "pointer" }} disabled={pending} onClick={() => start(() => togglePublish(table, id, !on))} aria-pressed={on} title="Click to toggle">
      {on ? "Published" : "Draft"}
    </button>
  )
}

export type LeadData = { id: number; name: string; email: string | null; phone: string | null; message: string | null; project_type: string | null; source: string; status: string; notes: string | null; call_date: string | null; call_time: string | null; created_at: string }

export function LeadRow({ l }: { l: LeadData }) {
  const [status, setStatus] = useState(l.status)
  const [notes, setNotes] = useState(l.notes ?? "")
  const [pending, start] = useTransition()
  const dirty = status !== l.status || notes !== (l.notes ?? "")
  return (
    <tr>
      <td>
        <div className="t">{l.name}</div>
        <div className="sub">{new Date(l.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</div>
        <div className="sub">{l.source}{l.project_type ? ` · ${l.project_type}` : ""}</div>
      </td>
      <td>
        {l.email && <div><a href={`mailto:${l.email}`}>{l.email}</a></div>}
        {l.phone && <div className="sub">{l.phone}</div>}
        {l.call_date && <div className="sub">Call: {l.call_date} {l.call_time}</div>}
      </td>
      <td style={{ maxWidth: 340, whiteSpace: "pre-wrap" }}>{l.message}</td>
      <td style={{ minWidth: 190 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" style={{ width: "100%", border: "1.5px solid var(--ink)", borderRadius: 10, padding: 6, marginBottom: 6 }}>
          <option value="new">New</option><option value="contacted">Contacted</option><option value="won">Won</option><option value="lost">Lost</option>
        </select>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" aria-label="Notes" style={{ width: "100%", border: "1.5px solid var(--ink)", borderRadius: 10, padding: 6, minHeight: 56, font: "inherit" }} />
        <div className="row-actions" style={{ marginTop: 6 }}>
          <button className="b sm solid" disabled={!dirty || pending} onClick={() => start(() => updateLead(l.id, status, notes))}>{pending ? "…" : "Save"}</button>
          <ConfirmDelete label={l.name} onConfirm={() => deleteLead(l.id)} />
        </div>
      </td>
    </tr>
  )
}
