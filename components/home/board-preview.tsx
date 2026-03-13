import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, User } from "lucide-react"
import type { BoardMember } from "@/lib/types"

interface BoardPreviewProps {
  members: BoardMember[]
}

export function BoardPreview({ members }: BoardPreviewProps) {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Leadership
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet Our Board
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/about#board">
              View Full Board
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="rounded-2xl bg-card p-12 text-center border border-border">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">Board members coming soon</p>
            <p className="mt-2 text-muted-foreground">Check back to meet our leadership team!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="group rounded-2xl bg-card p-6 text-center shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <User className="h-10 w-10 text-primary/50" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.position}</p>
                {member.bio && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
