import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from "lucide-react"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (!event) {
    return { title: "Event Not Found" }
  }

  return {
    title: event.title,
    description: event.description || `Join us for ${event.title}`,
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  if (!event) {
    notFound()
  }

  const isPast = new Date(event.event_date) < new Date()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>

            {/* Event Image */}
            {event.image_url && (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted mb-8">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Event Header */}
            <div className="mb-8">
              {isPast && (
                <span className="inline-block mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Past Event
                </span>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                {event.title}
              </h1>
            </div>

            {/* Event Details */}
            <div className="rounded-2xl bg-card p-6 border border-border mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Event Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.event_date)}</p>
                  </div>
                </div>
                {event.event_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Time</p>
                      <p className="text-sm text-muted-foreground">{event.event_time}</p>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Event Content */}
            {event.content && (
              <div className="prose prose-neutral max-w-none">
                <div dangerouslySetInnerHTML={{ __html: event.content }} />
              </div>
            )}

            {/* Share Button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
