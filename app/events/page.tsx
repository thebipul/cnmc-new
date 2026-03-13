import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  EventsPageClient,
  EventsListInitialData,
} from "@/components/events/events-page";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming community events, cultural celebrations, and gatherings hosted by Canadian Nepali Mahila Chautari.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: upcomingEvents }, { data: pastEvents }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true }),
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .lt("event_date", today)
      .order("event_date", { ascending: false })
      .limit(6),
  ]);

  const initialData: EventsListInitialData = {
    upcomingEvents: upcomingEvents ?? [],
    pastEvents: pastEvents ?? [],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Community Events
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Join us for cultural celebrations, workshops, community
              gatherings, and more. We bring our community together through
              meaningful events throughout the year.
            </p>
          </div>
        </div>
      </section>

      <EventsPageClient initialData={initialData} />

      <Footer />
    </div>
  );
}
