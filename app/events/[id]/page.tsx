import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  EventDetailClient,
  EventDetailInitialData,
} from "@/components/events/event-detail";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: event.title,
    description: event.description || `Join us for ${event.title}`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!event) {
    notFound();
  }

  const initialData: EventDetailInitialData = { event };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EventDetailClient id={id} initialData={initialData} />
      <Footer />
    </div>
  );
}
