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
import type { Event } from "@/lib/types"

interface EventFormProps {
  event?: Event
}

export function EventForm({ event }: EventFormProps) {
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
      description: formData.get("description") as string || null,
      content: formData.get("content") as string || null,
      event_date: formData.get("event_date") as string,
      event_time: formData.get("event_time") as string || null,
      location: formData.get("location") as string || null,
      image_url: formData.get("image_url") as string || null,
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
    }

    try {
      const supabase = createClient()

      if (event) {
        const { error } = await supabase
          .from("events")
          .update(data)
          .eq("id", event.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("events").insert(data)
        if (error) throw error
      }

      router.push("/admin/events")
      router.refresh()
    } catch (err) {
      console.error("Error saving event:", err)
      setError("Failed to save event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{event ? "Edit Event" : "Create Event"}</CardTitle>
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
              defaultValue={event?.title}
              placeholder="Event title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Short Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              defaultValue={event?.description || ""}
              placeholder="Brief description shown in event lists..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="event_date" className="block text-sm font-medium text-foreground mb-2">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                required
                defaultValue={event?.event_date}
              />
            </div>

            <div>
              <label htmlFor="event_time" className="block text-sm font-medium text-foreground mb-2">
                Time
              </label>
              <Input
                id="event_time"
                name="event_time"
                type="text"
                defaultValue={event?.event_time || ""}
                placeholder="e.g. 2:00 PM - 5:00 PM"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <Input
              id="location"
              name="location"
              defaultValue={event?.location || ""}
              placeholder="Event venue or address"
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-foreground mb-2">
              Image URL
            </label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={event?.image_url || ""}
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Full Description
            </label>
            <Textarea
              id="content"
              name="content"
              rows={8}
              defaultValue={event?.content || ""}
              placeholder="Detailed event information..."
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Switch
                id="is_published"
                name="is_published"
                defaultChecked={event?.is_published ?? true}
              />
              <label htmlFor="is_published" className="text-sm font-medium text-foreground">
                Published
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="is_featured"
                name="is_featured"
                defaultChecked={event?.is_featured ?? false}
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-foreground">
                Featured
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : event ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/events")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
