"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface SettingsFormProps {
  settings: Record<string, string | null>
}

const settingsFields = [
  {
    section: "Organization",
    fields: [
      { key: "organization_name", label: "Organization Name", type: "text" },
      { key: "mission_statement", label: "Mission Statement", type: "textarea" },
      { key: "about_text", label: "About Us Text", type: "textarea" },
    ],
  },
  {
    section: "Contact Information",
    fields: [
      { key: "contact_email", label: "Email", type: "email" },
      { key: "contact_phone", label: "Phone", type: "tel" },
      { key: "contact_address", label: "Address", type: "text" },
    ],
  },
  {
    section: "Social Media",
    fields: [
      { key: "facebook_url", label: "Facebook URL", type: "url" },
      { key: "instagram_url", label: "Instagram URL", type: "url" },
      { key: "youtube_url", label: "YouTube URL", type: "url" },
    ],
  },
]

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    
    try {
      const supabase = createClient()

      // Update each setting
      for (const section of settingsFields) {
        for (const field of section.fields) {
          const value = formData.get(field.key) as string || null
          
          const { error } = await supabase
            .from("site_settings")
            .upsert({ key: field.key, value }, { onConflict: "key" })
          
          if (error) throw error
        }
      }

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error saving settings:", err)
      setError("Failed to save settings. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-500/10 text-green-600 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Settings saved successfully!
        </div>
      )}

      {settingsFields.map((section) => (
        <Card key={section.section}>
          <CardHeader>
            <CardTitle className="text-lg">{section.section}</CardTitle>
            <CardDescription>
              Manage your {section.section.toLowerCase()} settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    name={field.key}
                    rows={3}
                    defaultValue={settings[field.key] || ""}
                  />
                ) : (
                  <Input
                    id={field.key}
                    name={field.key}
                    type={field.type}
                    defaultValue={settings[field.key] || ""}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </form>
  )
}
