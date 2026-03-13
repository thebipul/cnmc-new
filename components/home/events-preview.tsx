import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import type { Event } from "@/lib/types"

interface EventsPreviewProps {
  events: Event[]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function EventsPreview({ events }: EventsPreviewProps) {
  return (
    <section className="py-20 sm:py-28 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Upcoming Events
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Join Our Community
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/events">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl bg-card p-12 text-center border border-border">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">No upcoming events</p>
            <p className="mt-2 text-muted-foreground">Check back soon for new community events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group rounded-2xl bg-card overflow-hidden shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/20"
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.event_date)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-[120px]">{event.location}</span>
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
