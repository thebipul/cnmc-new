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
import { Badge } from "@/components/ui/badge"
import { FileText, Trash2, Download } from "lucide-react"
import type { NewsletterSubscriber } from "@/lib/types"

interface NewsletterTableProps {
  subscribers: NewsletterSubscriber[]
}

export function NewsletterTable({ subscribers }: NewsletterTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return
    
    setIsDeleting(id)
    const supabase = createClient()
    
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)
    
    if (error) {
      console.error("Error deleting subscriber:", error)
      alert("Failed to delete subscriber")
    } else {
      router.refresh()
    }
    
    setIsDeleting(null)
  }

  const handleExport = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active)
    const csv = ["Email,Subscribed Date"]
      .concat(activeSubscribers.map(s => `${s.email},${s.subscribed_at}`))
      .join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const activeCount = subscribers.filter(s => s.is_active).length

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {activeCount} active subscriber{activeCount !== 1 ? "s" : ""}
        </p>
        {subscribers.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No subscribers</h3>
          <p className="mt-2 text-muted-foreground">Newsletter subscribers will appear here.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                      {subscriber.is_active ? "Active" : "Unsubscribed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subscriber.id)}
                      disabled={isDeleting === subscriber.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
