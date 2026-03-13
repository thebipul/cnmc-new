import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "@/components/admin/gallery/gallery-form"

interface EditGalleryImagePageProps {
  params: Promise<{ id: string }>
}

export default async function EditGalleryImagePage({ params }: EditGalleryImagePageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const [{ data: image }, { data: events }] = await Promise.all([
    supabase.from("gallery_images").select("*").eq("id", id).single(),
    supabase.from("events").select("*").order("event_date", { ascending: false }),
  ])

  if (!image) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <GalleryForm image={image} events={events || []} />
    </div>
  )
}
