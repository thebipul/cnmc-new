import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BoardMembersTable } from "@/components/admin/board-members/board-members-table"

export default async function BoardMembersPage() {
  const supabase = await createClient()
  
  const { data: members } = await supabase
    .from("board_members")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Board Members</h2>
          <p className="text-muted-foreground">Manage your organization&apos;s board members</p>
        </div>
        <Button asChild>
          <Link href="/admin/board-members/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Link>
        </Button>
      </div>

      <BoardMembersTable members={members || []} />
    </div>
  )
}
