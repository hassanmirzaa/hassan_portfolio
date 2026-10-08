import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { ProjectForm, type ProjectData } from "@/components/admin/forms"

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle()
  if (!data) notFound()
  const screens = Array.isArray(data.screens) && data.screens.length ? data.screens : (data.screenshots ?? []).map((url: string) => ({ url }))
  const p: ProjectData = {
    ...data,
    description: data.description || data.long_description,
    screens: screens.length ? screens : data.cover_image ? [{ url: data.cover_image }] : [],
    features: Array.isArray(data.features) ? data.features : [],
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
  }
  return (
    <>
      <h1>Edit project</h1>
      <p className="lead">{data.title}</p>
      <ProjectForm p={p} />
    </>
  )
}
