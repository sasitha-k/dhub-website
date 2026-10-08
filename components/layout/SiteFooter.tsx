import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { packages } from "@/content/packages";
import { footerLegalLinks, navLinks, site } from "@/content/site";
import { phoneHref, whatsappHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const linkClass =
  "text-sm text-ink-secondary transition-colors hover:text-ink";
const headingClass =
  "text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase";
const socialClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/35 text-ink-secondary backdrop-blur-xl transition-colors hover:bg-white/55 hover:text-ink";

export function SiteFooter() {
  return (
    <footer className="relative">
      <GlassCard className="overflow-hidden">
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="inline-block" aria-label={site.name}>
              <BrandMark variant="light" className="h-7 w-auto sm:h-8" />
            </Link>
            <p className="mt-2 text-sm text-ink-muted">{site.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              href={phoneHref()}
              size="sm"
              variant="outline"
              className="hover:translate-y-0"
              aria-label={`Call ${site.phoneDisplay}`}
            >
              <Phone size={16} aria-hidden="true" />
              Call
            </Button>
            <Button
              href={whatsappHref(
                "Hi Drivers Hub, I would like to book a chauffeur.",
              )}
              size="sm"
              variant="outline"
              className="hover:translate-y-0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Drivers Hub"
            >
              <WhatsAppIcon />
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="grid gap-10 border-t border-line px-6 py-9 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          <address className="not-italic">
            <p className={headingClass}>Visit & call</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-secondary">
              <li className="flex items-start gap-3">
                <ContactIcon>
                  <MapPin size={14} aria-hidden="true" />
                </ContactIcon>
                <span className="max-w-[16rem]">
                  {site.address.street}, {site.address.locality},{" "}
                  {site.address.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <ContactIcon>
                  <Phone size={14} aria-hidden="true" />
                </ContactIcon>
                <a className={linkClass} href={phoneHref()}>
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <ContactIcon>
                  <Mail size={14} aria-hidden="true" />
                </ContactIcon>
                <a className={linkClass} href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <ContactIcon>
                  <Clock size={14} aria-hidden="true" />
                </ContactIcon>
                <span>
                  {site.hours.night}. {site.hours.day}.
                </span>
              </li>
            </ul>
          </address>
          <div>
            <p className={headingClass}>Explore</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link className={linkClass} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={headingClass}>Packages</p>
            <ul className="mt-4 space-y-2.5">
              {packages.map((item) => (
                <li key={item.slug}>
                  <Link className={linkClass} href={item.href}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={headingClass}>Legal</p>
            <ul className="mt-4 space-y-2.5">
              {footerLegalLinks.map((item) => (
                <li key={item.href}>
                  <Link className={linkClass} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-ink-muted">
            © 2026 {site.name}. Colombo chauffeur and designated-driver service.
          </p>
          <ul className="flex items-center gap-2">
            <li>
              <a
                className={socialClass}
                href={site.social.facebook}
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Drivers Hub on Facebook"
              >
                <FacebookIcon />
              </a>
            </li>
            <li>
              <a
                className={socialClass}
                href={site.social.instagram}
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Drivers Hub on Instagram"
              >
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a
                className={socialClass}
                href={whatsappHref()}
                rel="noopener noreferrer"
                target="_blank"
                aria-label="WhatsApp Drivers Hub"
              >
                <WhatsAppIcon />
              </a>
            </li>
          </ul>
        </div>
      </GlassCard>
    </footer>
  );
}

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/45 text-ink-secondary">
      {children}
    </span>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
