import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Target, Eye, Heart } from "lucide-react"
import { OBJECTIVE_ICONS } from "@/lib/objective-icons"
import { BOARD_MEMBERS_SELECT } from "@/lib/board-members"
import type { BoardMember } from "@/lib/types"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Canadian Nepali Mahila Chautari, our mission, vision, and the dedicated team working to empower women and strengthen our community.",
}

export default async function AboutPage() {
  const supabase = await createClient()
  
  const { data: boardMembers } = await supabase
    .from("board_members")
    .select(BOARD_MEMBERS_SELECT)
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, any>) || {}

  const objectives: Array<{ icon: string; text: string }> = Array.isArray(settingsMap.objectives)
    ? settingsMap.objectives
    : []

  const aboutParagraphs: string[] = typeof settingsMap.about_text === "string"
    ? settingsMap.about_text.split(/\n\n+/).filter(Boolean)
    : []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                About CNMC
              </h1>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground text-left">
                {aboutParagraphs.length > 0
                  ? aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)
                  : <p>Canadian Nepali Mahila Chautari (CNMC) is a non-profit organization dedicated to empowering women and promoting cultural unity within the Nepali-Canadian community.</p>
                }
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-card p-8 shadow-sm border border-border">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {settingsMap.mission_statement || "To empower Nepali-Canadian women through education, community support, and cultural preservation while fostering unity and mutual support among members."}
                </p>
              </div>

              <div className="rounded-2xl bg-card p-8 shadow-sm border border-border">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Our Vision</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  A thriving, connected Nepali-Canadian community where women are empowered leaders, cultural heritage is celebrated, and every member feels supported and valued.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-8 shadow-sm border border-border">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Our Values</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Community, empowerment, cultural preservation, inclusivity, respect, and service. We believe in lifting each other up and building bridges across generations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Objectives */}
        {objectives.length > 0 && (
          <section className="py-16 sm:py-24 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Our Goals
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Our Objectives
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {objectives.map((obj, i) => {
                  const Icon = OBJECTIVE_ICONS[obj.icon] ?? Target
                  return (
                    <div key={i} className="flex gap-4 rounded-2xl bg-card p-6 border border-border shadow-sm">
                      <div className="shrink-0 mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{obj.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Board Members */}
        <section id="board" className="py-16 sm:py-24 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Leadership
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Board of Directors
              </p>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the dedicated volunteers who lead our organization and work tirelessly to serve our community.
              </p>
            </div>

            {boardMembers && boardMembers.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {boardMembers.map((member: BoardMember) => (
                  <div
                    key={member.id}
                    className="rounded-2xl bg-card p-6 text-center shadow-sm border border-border"
                  >
                    <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-muted">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <User className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm font-medium text-primary">{member.position}</p>
                    {member.bio && (
                      <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-3 inline-block text-sm text-primary hover:underline"
                      >
                        {member.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-card p-12 text-center border border-border">
                <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-foreground">Board members coming soon</p>
                <p className="mt-2 text-muted-foreground">Check back to meet our leadership team!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
