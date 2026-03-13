import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, Gift, Users, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Canadian Nepali Mahila Chautari and help us continue empowering women and strengthening our community.",
}

const impactAreas = [
  {
    icon: Users,
    title: "Community Events",
    description: "Fund cultural celebrations, gatherings, and networking events that bring our community together.",
  },
  {
    icon: BookOpen,
    title: "Educational Programs",
    description: "Support workshops, training sessions, and educational resources for women and families.",
  },
  {
    icon: Gift,
    title: "Charitable Initiatives",
    description: "Help provide assistance to families in need and support community welfare programs.",
  },
  {
    icon: Heart,
    title: "Women Empowerment",
    description: "Fund mentorship programs, leadership training, and resources for women's advancement.",
  },
]

export default function DonatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Heart className="h-4 w-4" />
                <span>Support Our Mission</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                Make a Difference Today
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Your generous donation helps us continue our work empowering women, 
                preserving culture, and strengthening the Nepali-Canadian community.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-foreground">Your Impact</h2>
              <p className="mt-2 text-muted-foreground">See how your donation makes a difference</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impactAreas.map((area) => (
                <div
                  key={area.title}
                  className="rounded-2xl bg-card p-6 border border-border text-center"
                >
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <area.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{area.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Options */}
        <section className="py-16 sm:py-24 bg-muted/50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-card p-8 sm:p-12 border border-border text-center">
              <Heart className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-2xl font-bold text-foreground">Ready to Donate?</h2>
              <p className="mt-4 text-muted-foreground">
                We accept donations through various methods. Please contact us to learn 
                about the best way to contribute to our organization.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Contact Us to Donate</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:donate@cnmc.ca">Email: donate@cnmc.ca</a>
                </Button>
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                Canadian Nepali Mahila Chautari is a registered non-profit organization. 
                Tax receipts are available for eligible donations.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
