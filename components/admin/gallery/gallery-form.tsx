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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Event } from "@/lib/types"

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  event_id: string | null
  display_order: number
  is_published: boolean
}

interface GalleryFormProps {
  image?: GalleryImage
  events: Event[]
}

export function GalleryForm({ image, events }: GalleryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [selectedEventId, setSelectedEventId] = useState<string>(image?.event_id || "none")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string || null,
      description: formData.get("description") as string || null,
      image_url: formData.get("image_url") as string,
      event_id: selectedEventId === "none" ? null : selectedEventId,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_published: formData.get("is_published") === "on",
    }

    try {
      const supabase = createClient()

      if (image) {
        const { error } = await supabase
          .from("gallery_images")
          .update(data)
          .eq("id", image.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("gallery_images").insert(data)
        if (error) throw error
      }

      router.push("/admin/gallery")
      router.refresh()
    } catch (err) {
      console.error("Error saving image:", err)
      setError("Failed to save image. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{image ? "Edit Image" : "Add Image"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-foreground mb-2">
              Image URL <span className="text-destructive">*</span>
            </label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              required
              defaultValue={image?.image_url}
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={image?.title || ""}
              placeholder="Image title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={image?.description || ""}
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Related Event
            </label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No event</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="display_order" className="block text-sm font-medium text-foreground mb-2">
                Display Order
              </label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                min="0"
                defaultValue={image?.display_order || 0}
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <Switch
                id="is_published"
                name="is_published"
                defaultChecked={image?.is_published ?? true}
              />
              <label htmlFor="is_published" className="text-sm font-medium text-foreground">
                Published
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
              ) : image ? (
                "Update Image"
              ) : (
                "Add Image"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/gallery")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
