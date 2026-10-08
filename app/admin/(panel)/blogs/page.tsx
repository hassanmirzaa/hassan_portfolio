import Link from "next/link"
import { requireAdmin } from "@/lib/admin"
import { DeleteBlog, PublishToggle } from "@/components/admin/forms"

export default async function BlogsAdmin() {
  const { supabase } = await requireAdmin()
  const { data: blogs } = await supabase.from("blogs").select("id,title,slug,category,is_published,published_at").order("published_at", { ascending: false })
  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Blog posts</h1>
          <p className="lead">Short notes shown in the Writing section.</p>
        </div>
        <Link className="b solid" href="/admin/blogs/new">+ New post</Link>
      </div>
      <table className="tbl">
        <thead><tr><th>POST</th><th>CATEGORY</th><th>DATE</th><th>VISIBILITY</th><th /></tr></thead>
        <tbody>
          {(blogs ?? []).map((b) => (
            <tr key={b.id}>
              <td><div className="t">{b.title}</div><div className="sub">/blog/{b.slug}</div></td>
              <td>{b.category}</td>
              <td>{b.published_at ? new Date(b.published_at).toLocaleDateString("en-GB") : "—"}</td>
              <td><PublishToggle table="blogs" id={b.id} on={b.is_published} /></td>
              <td><div className="row-actions"><Link className="b sm" href={`/admin/blogs/${b.id}`}>Edit</Link><DeleteBlog id={b.id} title={b.title} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      {(blogs ?? []).length === 0 && <p className="lead" style={{ marginTop: 20 }}>No posts yet.</p>}
    </>
  )
}
