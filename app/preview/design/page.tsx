import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { homeFaqs } from "@/content/faqs";
import { homeTeaserPackages } from "@/content/packages";
import { services } from "@/content/services";
import { navLinks, site } from "@/content/site";
import { formatLkr } from "@/lib/format";
import { phoneHref, whatsappHref } from "@/lib/whatsapp";
import "./preview.css";

export const metadata: Metadata = {
  title: {
    absolute: "Design preview | Drivers Hub",
  },
  description:
    "Internal cream-glass homepage mock. Not a public Drivers Hub page.",
  robots: {
    index: false,
    follow: false,
  },
};

const servicePreview = services.slice(0, 2);
const bookMessage = "Hi Drivers Hub, I would like to book a chauffeur.";

export default function DesignPreviewPage() {
  return (
    <div className="dh-preview">
      <div className="dh-preview__marble" aria-hidden="true" />
      <div className="dh-preview__frame">
        <p className="dh-preview__banner">
          Design preview only — live site is unchanged.{" "}
          <Link href="/">Open current homepage</Link>
        </p>

        <div className="dh-preview__shell">
          <header className="dh-preview__header">
            <Link href="/" aria-label={site.name}>
              <BrandMark variant="light" priority className="h-5 sm:h-6" />
            </Link>
            <nav className="dh-preview__nav" aria-label="Preview primary">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.href === "/" ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="dh-preview__actions">
              <a className="dh-preview__pill dh-preview__pill--solid" href={phoneHref()}>
                <Phone size={16} aria-hidden="true" />
                Call
              </a>
              <a
                className="dh-preview__pill dh-preview__pill--solid"
                href={whatsappHref(bookMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
          </header>

          <p className="dh-preview__eyebrow">
            {site.name} / {site.address.locality}
          </p>
          <div className="dh-preview__title-row">
            <h1>Professional chauffeurs in Colombo</h1>
            <p className="dh-preview__meta">{site.tagline}</p>
          </div>
          <div className="dh-preview__toolbar">
            <a className="dh-preview__pill dh-preview__pill--solid" href={phoneHref()}>
              <Phone size={16} aria-hidden="true" />
              Call {site.phoneLocal}
            </a>
            <a
              className="dh-preview__pill dh-preview__pill--solid"
              href={whatsappHref(bookMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <Link className="dh-preview__pill dh-preview__pill--ghost" href="/packages">
              View packages
            </Link>
          </div>

          <section className="dh-preview__hero" aria-label="Chauffeur">
            <Image
              src="/hero-chauffeur.png"
              alt="A Drivers Hub chauffeur standing beside a dark sedan on a rain-slick Colombo street at night"
              fill
              priority
              sizes="(min-width: 1180px) 1180px, 100vw"
            />
            <div className="dh-preview__hero-shade" />
            <div className="dh-preview__hero-copy">
              <p className="dh-preview__eyebrow">{site.tagline}</p>
              <p>
                Designated driver, airport, and day or night packages. You stay
                in your car. We send a vetted chauffeur.
              </p>
              <div className="dh-preview__toolbar">
                <Link className="dh-preview__pill dh-preview__pill--ghost" href="/services">
                  All services
                </Link>
                <Link className="dh-preview__pill dh-preview__pill--ghost" href="/app">
                  Get the app
                </Link>
              </div>
            </div>
          </section>

          <div className="dh-preview__grid">
            {homeTeaserPackages.map((item) => (
              <Link key={item.slug} href={item.href} className="dh-preview__card">
                <p className="dh-preview__kicker">Package</p>
                <h2>{item.name}</h2>
                <p>{item.summary}</p>
                <p className="dh-preview__price">
                  {item.startingFromLkr
                    ? `Starting from ${formatLkr(item.startingFromLkr)}`
                    : "Ask for a quote"}
                </p>
              </Link>
            ))}
          </div>

          <div className="dh-preview__split">
            <article className="dh-preview__card">
              <p className="dh-preview__kicker">FAQ</p>
              <h2>Common questions</h2>
              <div className="dh-preview__faq dh-preview__faq-block">
                {homeFaqs.slice(0, 3).map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </article>

            <article className="dh-preview__card dh-preview__contact">
              <p className="dh-preview__kicker">Contact</p>
              <h2>Need a chauffeur tonight?</h2>
              <p>
                {site.address.line}. {site.hours.night}.
              </p>
              <div className="dh-preview__toolbar">
                <a className="dh-preview__pill dh-preview__pill--solid" href={phoneHref()}>
                  Call {site.phoneLocal}
                </a>
                <Link className="dh-preview__pill dh-preview__pill--ghost" href="/contact">
                  Contact page
                </Link>
              </div>
              {servicePreview.map((service) => (
                <Link
                  key={service.slug}
                  href={service.href}
                  className="dh-preview__service-link"
                >
                  {service.name} →
                </Link>
              ))}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
