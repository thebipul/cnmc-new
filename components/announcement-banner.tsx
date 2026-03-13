"use client"

import { useState } from "react"
import { X, Megaphone } from "lucide-react"
import type { Announcement } from "@/lib/types"

interface AnnouncementBannerProps {
  announcement: Announcement
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 pr-8">
          <Megaphone className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">
            <span className="font-semibold">{announcement.title}:</span>{" "}
            <span className="opacity-90">{announcement.content}</span>
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-primary-foreground/10 transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
