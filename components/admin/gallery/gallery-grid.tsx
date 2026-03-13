"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Pencil, Trash2 } from "lucide-react"

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  is_published: boolean
  events: { title: string } | null
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    
    setIsDeleting(id)
    const supabase = createClient()
    
    const { error } = await supabase.from("gallery_images").delete().eq("id", id)
    
    if (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image")
    } else {
      router.refresh()
    }
    
    setIsDeleting(null)
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium text-foreground">No images</h3>
        <p className="mt-2 text-muted-foreground">Get started by uploading your first image.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/gallery/new">Add Image</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative rounded-lg border border-border bg-card overflow-hidden"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={image.image_url}
              alt={image.title || "Gallery image"}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">
                  {image.title || "Untitled"}
                </p>
                {image.events?.title && (
                  <p className="text-xs text-muted-foreground truncate">
                    {image.events.title}
                  </p>
                )}
              </div>
              <Badge variant={image.is_published ? "default" : "secondary"} className="text-xs shrink-0">
                {image.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>

          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button asChild size="icon" variant="secondary" className="h-8 w-8">
              <Link href={`/admin/gallery/${image.id}`}>
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => handleDelete(image.id)}
              disabled={isDeleting === image.id}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
