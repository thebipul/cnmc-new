"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Plus, Trash2 } from "lucide-react"
import { OBJECTIVE_ICONS } from "@/lib/objective-icons"
import { cn } from "@/lib/utils"

interface Objective {
  icon: string
  text: string
}

interface SettingsFormProps {
  settings: Record<string, any>
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
  const [objectives, setObjectives] = useState<Objective[]>(
    () => Array.isArray(settings.objectives) ? settings.objectives : []
  )
  const router = useRouter()

  function addObjective() {
    setObjectives((prev) => [...prev, { icon: "Target", text: "" }])
  }

  function removeObjective(index: number) {
    setObjectives((prev) => prev.filter((_, i) => i !== index))
  }

  function updateObjective(index: number, field: keyof Objective, value: string) {
    setObjectives((prev) =>
      prev.map((obj, i) => (i === index ? { ...obj, [field]: value } : obj))
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      const supabase = createClient()

      for (const section of settingsFields) {
        for (const field of section.fields) {
          const value = formData.get(field.key) as string || null
          const { error } = await supabase
            .from("site_settings")
            .upsert({ key: field.key, value }, { onConflict: "key" })
          if (error) throw error
        }
      }

      const { error: objError } = await supabase
        .from("site_settings")
        .upsert({ key: "objectives", value: objectives }, { onConflict: "key" })
      if (objError) throw objError

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Objectives</CardTitle>
          <CardDescription>Pick an icon and add a description for each objective.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {objectives.map((obj, i) => {
            const SelectedIcon = OBJECTIVE_ICONS[obj.icon]
            return (
              <div key={i} className="space-y-2">
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary border border-border">
                    {SelectedIcon && <SelectedIcon className="h-5 w-5" />}
                  </div>
                  <Textarea
                    className="flex-1"
                    rows={2}
                    placeholder="Objective description…"
                    value={obj.text}
                    onChange={(e) => updateObjective(i, "text", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removeObjective(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 pl-13">
                  {Object.entries(OBJECTIVE_ICONS).map(([name, Icon]) => (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => updateObjective(i, "icon", name)}
                      className={cn(
                        "p-1.5 rounded-lg border transition-colors hover:bg-primary/10",
                        obj.icon === name
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-transparent text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
          <Button type="button" variant="outline" size="sm" onClick={addObjective}>
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </CardContent>
      </Card>

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
