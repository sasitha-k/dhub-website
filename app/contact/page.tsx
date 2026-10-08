import Link from "next/link";
import { ContactForm } from "@/components/marketing/ContactForm";
import { CtaRow } from "@/components/marketing/CtaRow";
import { InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { GlassCard } from "@/components/ui/GlassCard";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Drivers Hub 077 141 0588",
  description:
    "Contact Drivers Hub in Kotte: call or WhatsApp 077 141 0588, email info@drivershub.lk, or send a chauffeur request. Night service 24/7.",
  path: "/contact",
});

const mapSrc =
  "https://maps.google.com/maps?q=18%2F4%2C%205th%20Mission%20Lane%2C%20Sri%20Jayawardenepura%20Kotte&output=embed";

export default function ContactPage() {
  return (
    <InnerPage>
      <PageIntro
        kicker="Contact"
        title="Call, WhatsApp, or send a request"
        intro="Night chauffeur cover is 24/7. Day packages run 06:00–21:00. Chauffeur applications use the careers page."
      />
      <div className="dh-parallax-grid mt-10 grid gap-8 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-ink">Request a chauffeur</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            The form opens WhatsApp with your details. Nothing is stored on this
            site.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </GlassCard>
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-ink">Office</h2>
            <address className="mt-3 not-italic text-sm leading-7 text-ink-secondary">
              {site.address.line}
              <br />
              <a className="underline" href={`tel:${site.phoneE164}`}>
                {site.phoneDisplay}
              </a>
              <br />
              <a className="underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <br />
              {site.hours.night}. {site.hours.day}.
            </address>
            <div className="mt-6">
              <CtaRow message="Hi Drivers Hub, I would like to book a chauffeur." />
            </div>
          </GlassCard>
          <div className="overflow-hidden rounded-lg border border-line">
            <iframe
              title="Drivers Hub office map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full"
            />
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-ink-secondary">
        Applying to drive for us?{" "}
        <Link className="underline" href="/careers">
          Open chauffeur careers
        </Link>
        .
      </p>
    </InnerPage>
  );
}
