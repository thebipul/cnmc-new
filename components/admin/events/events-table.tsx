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
import { MoreHorizontal, Pencil, Trash2, Calendar, Eye } from "lucide-react"
import type { Event } from "@/lib/types"

interface EventsTableProps {
  events: Event[]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function EventsTable({ events }: EventsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    
    setIsDeleting(id)
    const supabase = createClient()
    
    const { error } = await supabase.from("events").delete().eq("id", id)
    
    if (error) {
      console.error("Error deleting event:", error)
      alert("Failed to delete event")
    } else {
      router.refresh()
    }
    
    setIsDeleting(null)
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium text-foreground">No events</h3>
        <p className="mt-2 text-muted-foreground">Get started by creating your first event.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/events/new">Add Event</Link>
        </Button>
      </div>
    )
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const isPast = event.event_date < today
            
            return (
              <TableRow key={event.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{formatDate(event.event_date)}</p>
                    {event.event_time && (
                      <p className="text-sm text-muted-foreground">{event.event_time}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {event.location || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {isPast && (
                      <Badge variant="secondary">Past</Badge>
                    )}
                    <Badge variant={event.is_published ? "default" : "outline"}>
                      {event.is_published ? "Published" : "Draft"}
                    </Badge>
                    {event.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isDeleting === event.id}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {event.is_published && (
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/events/${event.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(event.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
