import { createClient } from "@/lib/supabase/server"
import { NewsletterTable } from "@/components/admin/newsletter/newsletter-table"

export default async function NewsletterAdminPage() {
  const supabase = await createClient()
  
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Newsletter Subscribers</h2>
        <p className="text-muted-foreground">Manage your newsletter subscriber list</p>
      </div>

      <NewsletterTable subscribers={subscribers || []} />
    </div>
  )
}
