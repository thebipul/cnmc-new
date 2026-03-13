import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const [
      { data: upcomingEvents, error: upcomingError },
      { data: pastEvents, error: pastError },
    ] = await Promise.all([
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

    if (upcomingError || pastError) {
      console.error("Events API error", upcomingError || pastError);
      return NextResponse.json(
        { error: "Failed to load events" },
        { status: 500 },
      );
    }

    return NextResponse.json({ upcomingEvents, pastEvents });
  } catch (error) {
    console.error("Events API error", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 },
    );
  }
}
