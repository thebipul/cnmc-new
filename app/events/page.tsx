import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, MapPin, Clock } from "lucide-react"
import type { Event } from "@/lib/types"

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming community events, cultural celebrations, and gatherings hosted by Canadian Nepali Mahila Chautari.",
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

export default async function EventsPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  
  // Fetch upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })

  // Fetch past events
  const { data: pastEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .lt("event_date", today)
    .order("event_date", { ascending: false })
    .limit(6)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Community Events
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Join us for cultural celebrations, workshops, community gatherings, and more. 
                We bring our community together through meaningful events throughout the year.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">Upcoming Events</h2>
            
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event: Event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-card p-12 text-center border border-border">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-foreground">No upcoming events</p>
                <p className="mt-2 text-muted-foreground">Check back soon for new community events!</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <section className="py-16 sm:py-24 bg-muted/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">Past Events</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event: Event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

function EventCard({ event, isPast = false }: { event: Event; isPast?: boolean }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className={`group rounded-2xl bg-card overflow-hidden shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/20 ${isPast ? "opacity-80" : ""}`}
    >
      {event.image_url ? (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-primary/30" />
        </div>
      )}
      <div className="p-6">
        {isPast && (
          <span className="inline-block mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
            Past Event
          </span>
        )}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            {formatDate(event.event_date)}
          </span>
          {event.event_time && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              {event.event_time}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {event.location}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        {event.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </Link>
  )
}
