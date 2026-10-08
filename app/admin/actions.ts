"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase"

export type ActionState = { ok?: boolean; error?: string } | undefined

const BUCKET = "project-assets"
const MAX_BYTES = 10 * 1024 * 1024
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"]

/* ───────── auth ───────── */

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured) return { error: "Supabase is not configured on this deployment." }
  const email = String(form.get("email") ?? "").trim()
  const password = String(form.get("password") ?? "")
  if (!email || !password) return { error: "Enter your email and password." }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "That email and password don't match." }
  const { data: ok } = await supabase.rpc("is_admin")
  if (ok !== true) {
    await supabase.auth.signOut()
    return { error: "This account isn't an admin." }
  }
  redirect("/admin")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

/* ───────── helpers ───────── */

const text = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? "").trim()
  return v === "" ? null : v
}
const list = (f: FormData, k: string) =>
  String(f.get(k) ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
const bool = (f: FormData, k: string) => f.get(k) === "on"
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

async function upload(supabase: Awaited<ReturnType<typeof createClient>>, file: File, folder: string) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error(`${file.name}: only PNG, JPG, WebP or AVIF images.`)
  if (file.size > MAX_BYTES) throw new Error(`${file.name}: larger than 10 MB.`)
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw new Error(`Upload failed: ${error.message}`)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

const files = (f: FormData, k: string) => f.getAll(k).filter((x): x is File => x instanceof File && x.size > 0)

/* ───────── projects ───────── */

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  slug: z.string().min(1, "Slug is required").max(80).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers and dashes only"),
  summary: z.string().max(160).nullable(),
  description: z.string().min(1, "Description is required").max(4000),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Accent colour must look like #17403A"),
  year: z.string().max(10).nullable(),
  status: z.enum(["live", "in_development", "archived"]),
  sort_order: z.coerce.number().int().min(0).max(999),
})

export async function saveProject(id: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const title = String(form.get("title") ?? "").trim()
  const parsed = projectSchema.safeParse({
    title,
    slug: slugify(String(form.get("slug") || title)),
    summary: text(form, "summary"),
    description: String(form.get("description") ?? "").trim(),
    accent_color: String(form.get("accent_color") ?? "#17403A"),
    year: text(form, "year"),
    status: form.get("status") ?? "live",
    sort_order: form.get("sort_order") ?? 0,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  try {
    let cover_image = text(form, "cover_image")
    const cover = files(form, "cover_file")[0]
    if (cover) cover_image = await upload(supabase, cover, "covers")

    // Screens: one per line, "url | title | description". Title and description are optional.
    const screens = String(form.get("screens") ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [url, caption, ...text] = l.split("|").map((x) => x.trim())
        return { url, caption: caption || undefined, text: text.join(" | ") || undefined }
      })
      .filter((x) => /^https?:\/\/|^\//.test(x.url))
    for (const f of files(form, "screen_files")) screens.push({ url: await upload(supabase, f, "screens"), caption: undefined, text: undefined })

    // Features: one per line, "Title | description".
    const features = String(form.get("features") ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [title, ...text] = l.split("|").map((x) => x.trim())
        return { title, text: text.join(" | ") || undefined }
      })
      .filter((x) => x.title)

    // Highlights: one per line, "value | label". Real numbers only.
    const highlights = String(form.get("highlights") ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [value, ...label] = l.split("|").map((x) => x.trim())
        return { value, label: label.join(" | ") }
      })
      .filter((x) => x.value && x.label)

    const platforms = form.getAll("platforms").map(String).filter((x) => ["ios", "android", "web"].includes(x))

    const row = {
      ...parsed.data,
      cover_image,
      screens,
      features,
      highlights,
      platforms,
      client: text(form, "client"),
      role: text(form, "role"),
      problem: text(form, "problem"),
      approach: text(form, "approach"),
      outcome: text(form, "outcome"),
      metrics: text(form, "metrics"),
      category: text(form, "category") ?? "Mobile App",
      tech_stack: list(form, "tech_stack"),
      play_store_url: text(form, "play_store_url"),
      app_store_url: text(form, "app_store_url"),
      github_url: text(form, "github_url"),
      live_url: text(form, "live_url"),
      demo_video: text(form, "demo_video"),
      is_confidential: bool(form, "is_confidential"),
      is_featured: bool(form, "is_featured"),
      is_published: bool(form, "is_published"),
    }
    const q = id ? supabase.from("projects").update(row).eq("id", id) : supabase.from("projects").insert(row)
    const { error } = await q
    if (error) return { error: error.code === "23505" ? "That slug is already used by another project." : error.message }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." }
  }
  revalidatePath("/")
  revalidatePath(`/projects/${parsed.data.slug}`)
  redirect("/admin/projects")
}

export async function deleteProject(id: string) {
  const { supabase } = await requireAdmin()
  await supabase.from("projects").delete().eq("id", id)
  revalidatePath("/")
  revalidatePath("/admin/projects")
}

export async function togglePublish(table: "projects" | "blogs", id: string, value: boolean) {
  const { supabase } = await requireAdmin()
  await supabase.from(table).update({ is_published: value }).eq("id", id)
  revalidatePath("/")
  revalidatePath(`/admin/${table}`)
}

/* ───────── blogs ───────── */

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers and dashes only"),
  content: z.string().min(1, "Write something first"),
  excerpt: z.string().max(300).nullable(),
  category: z.string().max(60),
  author: z.string().max(80),
  sort_order: z.coerce.number().int().min(0).max(999),
})

export async function saveBlog(id: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const title = String(form.get("title") ?? "").trim()
  const parsed = blogSchema.safeParse({
    title,
    slug: slugify(String(form.get("slug") || title)),
    content: String(form.get("content") ?? "").trim(),
    excerpt: text(form, "excerpt"),
    category: String(form.get("category") || "General"),
    author: String(form.get("author") || "Hassan Mirza"),
    sort_order: form.get("sort_order") ?? 0,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const row = { ...parsed.data, tags: list(form, "tags"), is_published: bool(form, "is_published") }
  const { error } = id ? await supabase.from("blogs").update(row).eq("id", id) : await supabase.from("blogs").insert(row)
  if (error) return { error: error.code === "23505" ? "That slug is already used by another post." : error.message }
  revalidatePath("/")
  revalidatePath("/blog")
  revalidatePath(`/blog/${parsed.data.slug}`)
  redirect("/admin/blogs")
}

export async function deleteBlog(id: string) {
  const { supabase } = await requireAdmin()
  await supabase.from("blogs").delete().eq("id", id)
  revalidatePath("/")
  revalidatePath("/admin/blogs")
}

/* ───────── leads ───────── */

export async function updateLead(id: number, status: string, notes: string) {
  const { supabase } = await requireAdmin()
  if (!["new", "contacted", "won", "lost"].includes(status)) return
  await supabase
    .from("portfolio_leads")
    .update({ status, notes: notes.trim() || null, handled_at: status === "new" ? null : new Date().toISOString() })
    .eq("id", id)
  revalidatePath("/admin/leads")
  revalidatePath("/admin")
}

export async function deleteLead(id: number) {
  const { supabase } = await requireAdmin()
  await supabase.from("portfolio_leads").delete().eq("id", id)
  revalidatePath("/admin/leads")
  revalidatePath("/admin")
}

/* ───────── settings ───────── */

const url = z.string().url().nullable().or(z.literal(null))

export async function saveSettings(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const parsed = z
    .object({
      contact_email: z.string().email("Enter a valid contact email"),
      github_url: url,
      linkedin_url: url,
      instagram_url: url,
      upwork_url: url,
      available_from: z.string().max(40).nullable(),
    })
    .safeParse({
      contact_email: String(form.get("contact_email") ?? "").trim(),
      github_url: text(form, "github_url"),
      linkedin_url: text(form, "linkedin_url"),
      instagram_url: text(form, "instagram_url"),
      upwork_url: text(form, "upwork_url"),
      available_from: text(form, "available_from"),
    })
  if (!parsed.success) return { error: parsed.error.issues[0].message.includes("Invalid url") ? "Links must start with https://" : parsed.error.issues[0].message }
  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...parsed.data, is_available: bool(form, "is_available") })
  if (error) return { error: error.message }
  revalidatePath("/", "layout")
  return { ok: true }
}
