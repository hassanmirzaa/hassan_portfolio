import { requireAdmin } from "@/lib/admin"
import { ProjectForm } from "@/components/admin/forms"

export default async function NewProject() {
  await requireAdmin()
  return (
    <>
      <h1>New project</h1>
      <p className="lead">New projects start as drafts. Tick Published when it's ready.</p>
      <ProjectForm p={{}} />
    </>
  )
}
