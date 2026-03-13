import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { GalleryGrid } from "@/components/admin/gallery/gallery-grid"

export default async function GalleryAdminPage() {
  const supabase = await createClient()
  
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*, events(title)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
          <p className="text-muted-foreground">Manage your photo gallery</p>
        </div>
        <Button asChild>
          <Link href="/admin/gallery/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Link>
        </Button>
      </div>

      <GalleryGrid images={images || []} />
    </div>
  )
}
