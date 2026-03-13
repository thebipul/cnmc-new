import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/admin/settings/settings-form"

export default async function SettingsAdminPage() {
  const supabase = await createClient()
  
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string | null>) || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>
        <p className="text-muted-foreground">Manage your website settings and content</p>
      </div>

      <SettingsForm settings={settingsMap} />
    </div>
  )
}
