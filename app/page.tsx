import { createClient } from "@/lib/supabase/server"
import { BOARD_MEMBERS_SELECT } from "@/lib/board-members"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { MissionSection } from "@/components/home/mission-section"
import { EventsPreview } from "@/components/home/events-preview"
import { BoardPreview } from "@/components/home/board-preview"
import { AnnouncementBanner } from "@/components/announcement-banner"

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch upcoming events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date", { ascending: true })
    .limit(3)

  // Fetch board members
  const { data: boardMembers } = await supabase
    .from("board_members")
    .select(BOARD_MEMBERS_SELECT)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(4)

  // Fetch active announcements
  const today = new Date().toISOString().split("T")[0]
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("created_at", { ascending: false })
    .limit(1)

  // Fetch site settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string | null>) || {}

  return (
    <div className="flex min-h-screen flex-col">
      {announcements && announcements.length > 0 && (
        <AnnouncementBanner announcement={announcements[0]} />
      )}
      <Header />
      <main className="flex-1">
        <HeroSection 
          missionStatement={settingsMap.mission_statement || "Empowering women and building community"} 
        />
        <MissionSection />
        <EventsPreview events={events || []} />
        <BoardPreview members={boardMembers || []} />
      </main>
      <Footer />
    </div>
  )
}
