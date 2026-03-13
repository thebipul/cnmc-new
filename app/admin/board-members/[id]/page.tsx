import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BoardMemberForm } from "@/components/admin/board-members/board-member-form"

interface EditBoardMemberPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBoardMemberPage({ params }: EditBoardMemberPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: member } = await supabase
    .from("board_members")
    .select("*")
    .eq("id", id)
    .single()

  if (!member) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <BoardMemberForm member={member} />
    </div>
  )
}
