import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "@/components/admin/gallery/gallery-form"

export default async function NewGalleryImagePage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false })

  return (
    <div className="max-w-2xl">
      <GalleryForm events={events || []} />
    </div>
  )
}
