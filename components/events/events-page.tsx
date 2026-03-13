"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";

export interface EventsListInitialData {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const fetchEvents = async () => {
  const response = await fetch("/api/events", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json() as Promise<EventsListInitialData>;
};

export function EventsPageClient({
  initialData,
}: {
  initialData: EventsListInitialData;
}) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["events", "list"],
    queryFn: fetchEvents,
    initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  const upcomingEvents = data?.upcomingEvents ?? [];
  const pastEvents = data?.pastEvents ?? [];

  const prefetchEvent = async (id: string) => {
    await queryClient.prefetchQuery(["events", id], async () => {
      const res = await fetch(`/api/events/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to prefetch event");
      const json = await res.json();
      return json.event as Event;
    });
  };

  const renderEventCard = (event: Event, isPast = false) => {
    const formattedDate = formatDate(event.event_date);

    return (
      <Link
        key={event.id}
        href={`/events/${event.id}`}
        className={`group rounded-2xl bg-card overflow-hidden shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/20 ${
          isPast ? "opacity-80" : ""
        }`}
        onMouseEnter={() => void prefetchEvent(event.id)}
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
              {formattedDate}
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
    );
  };

  return (
    <main className="flex-1">
      {/* Upcoming Events */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Upcoming Events
          </h2>

          {isLoading ? (
            <div className="rounded-2xl bg-card p-12 text-center border border-border">
              <p className="text-lg font-medium text-foreground">
                Loading events…
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl bg-card p-12 text-center border border-border">
              <p className="text-lg font-medium text-foreground">
                Unable to load events.
              </p>
            </div>
          ) : upcomingEvents.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => renderEventCard(event))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-12 text-center border border-border">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-foreground">
                No upcoming events
              </p>
              <p className="mt-2 text-muted-foreground">
                Check back soon for new community events!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-16 sm:py-24 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => renderEventCard(event, true))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
