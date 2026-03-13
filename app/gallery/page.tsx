import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { ImageIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse photos from our community events, cultural celebrations, and gatherings hosted by Canadian Nepali Mahila Chautari.",
}

export default async function GalleryPage() {
  const supabase = await createClient()
  
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*, events(title)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Photo Gallery
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Explore memories from our community events, cultural celebrations, and special gatherings.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {images && images.length > 0 ? (
              <GalleryGrid images={images} />
            ) : (
              <div className="rounded-2xl bg-card p-12 text-center border border-border">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-foreground">No photos yet</p>
                <p className="mt-2 text-muted-foreground">Check back soon for photos from our events!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
