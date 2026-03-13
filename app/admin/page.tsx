import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, ImageIcon, Mail, Megaphone, UserPlus } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts for dashboard
  const [
    { count: boardCount },
    { count: eventsCount },
    { count: galleryCount },
    { count: messagesCount },
    { count: announcementsCount },
    { count: subscribersCount },
  ] = await Promise.all([
    supabase.from("board_members").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("announcements").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("is_active", true),
  ])

  const stats = [
    {
      title: "Board Members",
      value: boardCount || 0,
      icon: Users,
      href: "/admin/board-members",
      description: "Active board members",
    },
    {
      title: "Events",
      value: eventsCount || 0,
      icon: Calendar,
      href: "/admin/events",
      description: "Total events",
    },
    {
      title: "Gallery Images",
      value: galleryCount || 0,
      icon: ImageIcon,
      href: "/admin/gallery",
      description: "Photos uploaded",
    },
    {
      title: "Unread Messages",
      value: messagesCount || 0,
      icon: Mail,
      href: "/admin/messages",
      description: "Awaiting response",
    },
    {
      title: "Active Announcements",
      value: announcementsCount || 0,
      icon: Megaphone,
      href: "/admin/announcements",
      description: "Currently showing",
    },
    {
      title: "Newsletter Subscribers",
      value: subscribersCount || 0,
      icon: UserPlus,
      href: "/admin/newsletter",
      description: "Active subscribers",
    },
  ]

  // Fetch recent messages
  const { data: recentMessages } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to the CNMC admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages && recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{message.name}</p>
                      {!message.is_read && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {message.subject || message.message}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No messages yet</p>
          )}
          {recentMessages && recentMessages.length > 0 && (
            <Link
              href="/admin/messages"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View all messages
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
