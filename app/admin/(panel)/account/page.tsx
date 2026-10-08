import { requireAdmin } from "@/lib/admin"
import { PasswordForm } from "@/components/admin/forms"

export default async function Account() {
  const { user } = await requireAdmin()
  return (
    <>
      <h1>Account</h1>
      <p className="lead">Signed in as {user.email}.</p>
      <PasswordForm />
    </>
  )
}
