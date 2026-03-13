import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EventForm } from "@/components/admin/events/event-form"

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <EventForm event={event} />
    </div>
  )
}
