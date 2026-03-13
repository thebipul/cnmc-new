import { createClient } from "@/lib/supabase/server"
import { MessagesTable } from "@/components/admin/messages/messages-table"

export default async function MessagesAdminPage() {
  const supabase = await createClient()
  
  const { data: messages } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <MessagesTable messages={messages || []} />
    </div>
  )
}
