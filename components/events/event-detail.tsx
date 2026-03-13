"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, Share2 } from "lucide-react";
import type { Event } from "@/lib/types";

export interface EventDetailInitialData {
  event: Event;
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

const fetchEventById = async (id: string) => {
  const response = await fetch(`/api/events/${id}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  const data = await response.json();
  return data.event as Event;
};

export function EventDetailClient({
  id,
  initialData,
}: {
  id: string;
  initialData?: EventDetailInitialData;
}) {
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => fetchEventById(id),
    ...(initialData?.event ? { initialData: initialData.event } : {}),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  const isPast = event ? new Date(event.event_date) < new Date() : false;

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-lg font-medium text-foreground">
              Loading event details…
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !event) {
    return (
      <main className="flex-1">
        <div className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-lg font-medium text-foreground">
              Event not found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          {event.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted mb-8">
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

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

          <div className="rounded-2xl bg-card p-6 border border-border mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Event Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.event_date)}
                  </p>
                </div>
              </div>
              {event.event_time && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {event.event_time}
                    </p>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Location
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {event.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                About This Event
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {event.content && (
            <div className="prose prose-neutral max-w-none">
              <div dangerouslySetInnerHTML={{ __html: event.content }} />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Event
            </Button>
          </div>
        </div>
      </article>
    </main>
  );
}
