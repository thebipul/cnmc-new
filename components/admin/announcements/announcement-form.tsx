"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Announcement } from "@/lib/types"

interface AnnouncementFormProps {
  announcement?: Announcement
}

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      start_date: formData.get("start_date") as string || null,
      end_date: formData.get("end_date") as string || null,
      is_active: formData.get("is_active") === "on",
    }

    try {
      const supabase = createClient()

      if (announcement) {
        const { error } = await supabase
          .from("announcements")
          .update(data)
          .eq("id", announcement.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("announcements").insert(data)
        if (error) throw error
      }

      router.push("/admin/announcements")
      router.refresh()
    } catch (err) {
      console.error("Error saving announcement:", err)
      setError("Failed to save announcement. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{announcement ? "Edit Announcement" : "Create Announcement"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={announcement?.title}
              placeholder="Announcement title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Content <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="content"
              name="content"
              required
              rows={3}
              defaultValue={announcement?.content}
              placeholder="Announcement message..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-foreground mb-2">
                Start Date
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={announcement?.start_date || ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to start immediately</p>
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-foreground mb-2">
                End Date
              </label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={announcement?.end_date || ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to show indefinitely</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              name="is_active"
              defaultChecked={announcement?.is_active ?? true}
            />
            <label htmlFor="is_active" className="text-sm font-medium text-foreground">
              Active
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : announcement ? (
                "Update Announcement"
              ) : (
                "Create Announcement"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/announcements")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
