import { requireAdmin } from "@/lib/admin"
import { SettingsForm } from "@/components/admin/forms"
import { getSettings } from "@/lib/settings"

export default async function SettingsAdmin() {
  await requireAdmin()
  const s = await getSettings()
  return (
    <>
      <h1>Site settings</h1>
      <p className="lead">Contact details and the availability pill in the header.</p>
      <SettingsForm s={s} />
    </>
  )
}
