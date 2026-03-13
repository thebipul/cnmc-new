"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Megaphone } from "lucide-react"
import type { Announcement } from "@/lib/types"

interface AnnouncementsTableProps {
  announcements: Announcement[]
}

export function AnnouncementsTable({ announcements }: AnnouncementsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return
    
    setIsDeleting(id)
    const supabase = createClient()
    
    const { error } = await supabase.from("announcements").delete().eq("id", id)
    
    if (error) {
      console.error("Error deleting announcement:", error)
      alert("Failed to delete announcement")
    } else {
      router.refresh()
    }
    
    setIsDeleting(null)
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium text-foreground">No announcements</h3>
        <p className="mt-2 text-muted-foreground">Create an announcement to display on your website.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/announcements/new">Add Announcement</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell className="font-medium">{announcement.title}</TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                  {announcement.content}
                </p>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {announcement.start_date && (
                    <span>{new Date(announcement.start_date).toLocaleDateString()}</span>
                  )}
                  {announcement.start_date && announcement.end_date && <span> - </span>}
                  {announcement.end_date && (
                    <span>{new Date(announcement.end_date).toLocaleDateString()}</span>
                  )}
                  {!announcement.start_date && !announcement.end_date && (
                    <span className="text-muted-foreground">Always</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={announcement.is_active ? "default" : "secondary"}>
                  {announcement.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isDeleting === announcement.id}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/announcements/${announcement.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(announcement.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
