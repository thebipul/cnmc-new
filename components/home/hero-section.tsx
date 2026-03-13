import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

interface HeroSectionProps {
  missionStatement: string
}

export function HeroSection({ missionStatement }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-28 lg:py-36">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" />
            <span>Building Stronger Communities Together</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Canadian Nepali{" "}
            <span className="text-primary">Mahila Chautari</span>
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl text-pretty">
            {missionStatement}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/about">
                Learn About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/events">View Events</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Years Active", value: "10+" },
            { label: "Community Events", value: "50+" },
            { label: "Members", value: "200+" },
            { label: "Families Supported", value: "100+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-card p-6 text-center shadow-sm border border-border"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
