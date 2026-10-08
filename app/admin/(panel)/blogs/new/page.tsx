import { requireAdmin } from "@/lib/admin"
import { BlogForm } from "@/components/admin/forms"

export default async function NewBlog() {
  await requireAdmin()
  return (
    <>
      <h1>New post</h1>
      <BlogForm b={{}} />
    </>
  )
}
