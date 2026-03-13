import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnnouncementForm } from "@/components/admin/announcements/announcement-form"

interface EditAnnouncementPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single()

  if (!announcement) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <AnnouncementForm announcement={announcement} />
    </div>
  )
}
