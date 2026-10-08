import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { ProjectForm, type ProjectData } from "@/components/admin/forms"

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle()
  if (!data) notFound()
  const p: ProjectData = {
    ...data,
    // The site shows one text. Edit the long version if the old row had one.
    description: data.long_description || data.description,
    screens: Array.isArray(data.screens) && data.screens.length ? data.screens : (data.screenshots ?? []).map((url: string) => ({ url })),
  }
  return (
    <>
      <h1>Edit project</h1>
      <p className="lead">{data.title}</p>
      <ProjectForm p={p} />
    </>
  )
}
