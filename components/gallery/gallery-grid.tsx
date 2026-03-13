"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  events: { title: string } | null
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  
  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    }
  }
  
  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <img
              src={image.image_url}
              alt={image.title || "Gallery image"}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {(image.title || image.events?.title) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                {image.title && (
                  <p className="text-sm font-medium text-white">{image.title}</p>
                )}
                {image.events?.title && (
                  <p className="text-xs text-white/80 mt-1">{image.events.title}</p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="max-w-5xl max-h-[80vh] px-16">
            <img
              src={images[selectedIndex].image_url}
              alt={images[selectedIndex].title || "Gallery image"}
              className="max-h-[80vh] max-w-full object-contain"
            />
            {(images[selectedIndex].title || images[selectedIndex].description) && (
              <div className="mt-4 text-center">
                {images[selectedIndex].title && (
                  <p className="text-lg font-medium text-white">{images[selectedIndex].title}</p>
                )}
                {images[selectedIndex].description && (
                  <p className="text-sm text-white/80 mt-1">{images[selectedIndex].description}</p>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
