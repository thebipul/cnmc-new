import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { EventsTable } from "@/components/admin/events/events-table"

export default async function EventsAdminPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Events</h2>
          <p className="text-muted-foreground">Manage your community events</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </Button>
      </div>

      <EventsTable events={events || []} />
    </div>
  )
}
