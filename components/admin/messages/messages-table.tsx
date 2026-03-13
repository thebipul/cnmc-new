"use client"

import { useState } from "react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, Trash2, Eye } from "lucide-react"
import type { ContactSubmission } from "@/lib/types"

interface MessagesTableProps {
  messages: ContactSubmission[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleView = async (message: ContactSubmission) => {
    setSelectedMessage(message)
    
    if (!message.is_read) {
      const supabase = createClient()
      await supabase
        .from("contact_submissions")
        .update({ is_read: true })
        .eq("id", message.id)
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    setIsDeleting(id)
    const supabase = createClient()
    
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)
    
    if (error) {
      console.error("Error deleting message:", error)
      alert("Failed to delete message")
    } else {
      setSelectedMessage(null)
      router.refresh()
    }
    
    setIsDeleting(null)
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium text-foreground">No messages</h3>
        <p className="mt-2 text-muted-foreground">Contact form submissions will appear here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className={!message.is_read ? "bg-primary/5" : ""}>
                <TableCell>
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-1">{message.subject || message.message}</p>
                </TableCell>
                <TableCell>
                  {new Date(message.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={message.is_read ? "secondary" : "default"}>
                    {message.is_read ? "Read" : "New"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(message)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(message.id)}
                      disabled={isDeleting === message.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">From</p>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>
              {selectedMessage.subject && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p>{selectedMessage.subject}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Received</p>
                <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button asChild>
                  <a href={`mailto:${selectedMessage.email}`}>Reply via Email</a>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={isDeleting === selectedMessage.id}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
