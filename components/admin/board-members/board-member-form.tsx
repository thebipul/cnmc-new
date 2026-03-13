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
import type { BoardMember } from "@/lib/types"

interface BoardMemberFormProps {
  member?: BoardMember
}

export function BoardMemberForm({ member }: BoardMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      bio: formData.get("bio") as string || null,
      image_url: formData.get("image_url") as string || null,
      email: formData.get("email") as string || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "on",
    }

    try {
      const supabase = createClient()

      if (member) {
        const { error } = await supabase
          .from("board_members")
          .update(data)
          .eq("id", member.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("board_members").insert(data)
        if (error) throw error
      }

      router.push("/admin/board-members")
      router.refresh()
    } catch (err) {
      console.error("Error saving board member:", err)
      setError("Failed to save board member. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{member ? "Edit Board Member" : "Add Board Member"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={member?.name}
                placeholder="Full name"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-foreground mb-2">
                Position <span className="text-destructive">*</span>
              </label>
              <Input
                id="position"
                name="position"
                required
                defaultValue={member?.position}
                placeholder="e.g. President, Vice President"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={member?.email || ""}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={member?.bio || ""}
              placeholder="Brief biography..."
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
              defaultValue={member?.image_url || ""}
              placeholder="https://..."
            />
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
                defaultValue={member?.display_order || 0}
              />
              <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-center gap-3 pt-8">
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={member?.is_active ?? true}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-foreground">
                Active (visible on website)
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
              ) : member ? (
                "Update Member"
              ) : (
                "Add Member"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/board-members")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
