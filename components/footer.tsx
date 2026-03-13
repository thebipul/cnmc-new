import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail } from "lucide-react"
import { NewsletterForm } from "./newsletter-form"

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://youtube.com", label: "YouTube", icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Organization Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
                C
              </div>
              <div>
                <p className="text-lg font-semibold">CNMC</p>
                <p className="text-xs text-sidebar-foreground/70">Canadian Nepali Mahila Chautari</p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/80 leading-relaxed">
              Empowering women, preserving culture, and building a stronger Nepali-Canadian community together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Connect With Us</h3>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-4 w-4 text-sidebar-foreground/70" />
              <a
                href="mailto:info@cnmc.ca"
                className="text-sm text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors"
              >
                info@cnmc.ca
              </a>
            </div>
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Stay Updated</h4>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-sidebar-border pt-6">
          <p className="text-center text-xs text-sidebar-foreground/60">
            {new Date().getFullYear()} Canadian Nepali Mahila Chautari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
