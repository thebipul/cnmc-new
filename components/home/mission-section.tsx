import { Users, Heart, Globe, BookOpen } from "lucide-react"

const values = [
  {
    icon: Users,
    title: "Women Empowerment",
    description: "Supporting and uplifting Nepali women in Canada through mentorship, resources, and community support.",
  },
  {
    icon: Heart,
    title: "Community Unity",
    description: "Fostering strong bonds within our community through cultural events, gatherings, and mutual support.",
  },
  {
    icon: Globe,
    title: "Cultural Preservation",
    description: "Preserving and celebrating our rich Nepali heritage while embracing our Canadian identity.",
  },
  {
    icon: BookOpen,
    title: "Education & Growth",
    description: "Providing workshops, resources, and opportunities for personal and professional development.",
  },
]

export function MissionSection() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our Mission
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Empowering Women, Strengthening Communities
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            We are dedicated to creating a supportive environment where Nepali-Canadian women can thrive, connect, and make a positive impact.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="group relative rounded-2xl bg-card p-8 shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
