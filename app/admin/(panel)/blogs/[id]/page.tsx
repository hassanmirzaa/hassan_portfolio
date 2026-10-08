import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { BlogForm } from "@/components/admin/forms"

export default async function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle()
  if (!data) notFound()
  return (
    <>
      <h1>Edit post</h1>
      <p className="lead">{data.title}</p>
      <BlogForm b={data} />
    </>
  )
}
