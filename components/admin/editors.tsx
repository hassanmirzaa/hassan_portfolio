"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/browser"

const BUCKET = "project-assets"
const MAX_WIDTH = 1290 // px. Phone screenshots are never shown wider than this.
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif"]

export type ScreenItem = { url: string; caption?: string; text?: string }
export type FeatureItem = { title: string; text?: string }
export type HighlightItem = { value: string; label: string }

/** Shrinks big screenshots to WebP before upload (a 3 MB PNG becomes ~150 KB). Falls back to the original file. */
async function prepare(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  const orig = { blob: file as Blob, ext: (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, ""), type: file.type }
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, MAX_WIDTH / bmp.width)
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.9))
    return blob && blob.size < file.size ? { blob, ext: "webp", type: "image/webp" } : orig
  } catch {
    return orig
  }
}

const move = <T,>(list: T[], i: number, d: -1 | 1) => {
  const j = i + d
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

export function ScreensEditor({ name, initial, folder }: { name: string; initial: ScreenItem[]; folder: string }) {
  const [items, setItems] = useState<ScreenItem[]>(initial)
  const [busy, setBusy] = useState<string[]>([])
  const [error, setError] = useState("")
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const upload = async (files: File[]) => {
    setError("")
    const supabase = createClient()
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        setError(`${file.name}: use PNG, JPG, WebP or AVIF.`)
        continue
      }
      setBusy((b) => [...b, file.name])
      try {
        const { blob, ext, type } = await prepare(file)
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: err } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: type, upsert: false })
        if (err) throw new Error(err.message)
        const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
        setItems((list) => [...list, { url }])
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`)
      } finally {
        setBusy((b) => b.filter((n) => n !== file.name))
      }
    }
  }

  const patch = (i: number, p: Partial<ScreenItem>) => setItems((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)))

  return (
    <div className="ed">
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div
        className={`drop${over ? " over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          upload(Array.from(e.dataTransfer.files))
        }}
      >
        <button type="button" className="b" onClick={() => input.current?.click()}>
          + Add screenshots
        </button>
        <span>Choose several at once from your photos (or drop them here on a computer). They are shrunk automatically. The first screen is the cover.</span>
        <input ref={input} type="file" multiple hidden accept={ALLOWED.join(",")} onChange={(e) => e.target.files && upload(Array.from(e.target.files))} />
      </div>
      {busy.length > 0 && <div className="msg-ok">Uploading {busy.join(", ")}…</div>}
      {error && <div className="msg-err" role="alert">{error}</div>}

      <ol className="scr-list">
        {items.map((it, i) => (
          <li key={it.url + i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="thumb" src={it.url} alt="" />
            <div className="scr-fields">
              <div className="scr-n">Screen {i + 1}{i === 0 ? " · cover" : ""}</div>
              <input type="text" value={it.caption ?? ""} onChange={(e) => patch(i, { caption: e.target.value })} placeholder="Title (e.g. Order tracking)" aria-label={`Screen ${i + 1} title`} maxLength={80} />
              <textarea value={it.text ?? ""} onChange={(e) => patch(i, { text: e.target.value })} placeholder="What this screen does, in a sentence or two" aria-label={`Screen ${i + 1} description`} maxLength={400} />
            </div>
            <div className="scr-act">
              <button type="button" className="b sm" onClick={() => setItems((l) => move(l, i, -1))} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="b sm" onClick={() => setItems((l) => move(l, i, 1))} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="b sm danger" onClick={() => setItems((l) => l.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
            </div>
          </li>
        ))}
      </ol>
      {items.length === 0 && busy.length === 0 && <p className="hint">No screens yet. Add at least one so the app shows on the site.</p>}
    </div>
  )
}

export function FeaturesEditor({ name, initial }: { name: string; initial: FeatureItem[] }) {
  const [items, setItems] = useState<FeatureItem[]>(initial)
  const patch = (i: number, p: Partial<FeatureItem>) => setItems((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)))
  return (
    <div className="ed">
      <input type="hidden" name={name} value={JSON.stringify(items.filter((x) => x.title.trim()))} />
      <ol className="row-list">
        {items.map((it, i) => (
          <li key={i}>
            <span className="scr-n">{String(i + 1).padStart(2, "0")}</span>
            <div className="scr-fields">
              <input type="text" value={it.title} onChange={(e) => patch(i, { title: e.target.value })} placeholder="Feature (e.g. Live order tracking)" aria-label={`Feature ${i + 1} title`} maxLength={120} />
              <textarea value={it.text ?? ""} onChange={(e) => patch(i, { text: e.target.value })} placeholder="What it does for the user" aria-label={`Feature ${i + 1} description`} maxLength={500} />
            </div>
            <div className="scr-act">
              <button type="button" className="b sm" onClick={() => setItems((l) => move(l, i, -1))} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="b sm" onClick={() => setItems((l) => move(l, i, 1))} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="b sm danger" onClick={() => setItems((l) => l.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="b" onClick={() => setItems((l) => [...l, { title: "", text: "" }])}>+ Add feature</button>
    </div>
  )
}

export function HighlightsEditor({ name, initial }: { name: string; initial: HighlightItem[] }) {
  const [items, setItems] = useState<HighlightItem[]>(initial)
  const patch = (i: number, p: Partial<HighlightItem>) => setItems((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)))
  return (
    <div className="ed">
      <input type="hidden" name={name} value={JSON.stringify(items.filter((x) => x.value.trim() && x.label.trim()))} />
      <ol className="row-list">
        {items.map((it, i) => (
          <li key={i}>
            <div className="scr-fields hl-row">
              <input type="text" value={it.value} onChange={(e) => patch(i, { value: e.target.value })} placeholder="1K+" aria-label={`Number ${i + 1}`} maxLength={20} />
              <input type="text" value={it.label} onChange={(e) => patch(i, { label: e.target.value })} placeholder="Downloads" aria-label={`Label ${i + 1}`} maxLength={60} />
            </div>
            <div className="scr-act">
              <button type="button" className="b sm danger" onClick={() => setItems((l) => l.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="b" onClick={() => setItems((l) => [...l, { value: "", label: "" }])}>+ Add number</button>
      <p className="hint">Real numbers only (downloads, users, rating, time saved). Leave empty rather than guess.</p>
    </div>
  )
}
