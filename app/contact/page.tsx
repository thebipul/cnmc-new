import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Canadian Nepali Mahila Chautari. We would love to hear from you!",
}

export default async function ContactPage() {
  const supabase = await createClient()
  
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string | null>) || {}

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Have questions or want to get involved? We would love to hear from you. 
                Reach out to us and we will get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Whether you have questions about membership, upcoming events, or ways to contribute, 
                  our team is here to help.
                </p>

                <div className="space-y-6">
                  {settingsMap.contact_email && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <a
                          href={`mailto:${settingsMap.contact_email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {settingsMap.contact_email}
                        </a>
                      </div>
                    </div>
                  )}

                  {settingsMap.contact_phone && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <a
                          href={`tel:${settingsMap.contact_phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {settingsMap.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {settingsMap.contact_address && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-muted-foreground">{settingsMap.contact_address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="mt-10 pt-10 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {settingsMap.facebook_url && (
                      <a
                        href={settingsMap.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {settingsMap.instagram_url && (
                      <a
                        href={settingsMap.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {settingsMap.youtube_url && (
                      <a
                        href={settingsMap.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl bg-card p-8 border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
