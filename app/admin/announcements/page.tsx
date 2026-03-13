import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AnnouncementsTable } from "@/components/admin/announcements/announcements-table"

export default async function AnnouncementsAdminPage() {
  const supabase = await createClient()
  
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Announcements</h2>
          <p className="text-muted-foreground">Manage website announcements and banners</p>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Announcement
          </Link>
        </Button>
      </div>

      <AnnouncementsTable announcements={announcements || []} />
    </div>
  )
}
