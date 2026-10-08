import type { Metadata } from "next";
import { HomeMasthead } from "@/components/layout/HomeMasthead";
import { SectionCard } from "@/components/layout/SectionCard";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { HomeApp } from "@/components/marketing/HomeApp";
import { HomeFaq } from "@/components/marketing/HomeFaq";
import { HomeStats } from "@/components/marketing/HomeStats";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhyDriversHub } from "@/components/marketing/WhyDriversHub";
import { TestimonialQuotes } from "@/components/marketing/TestimonialQuotes";
import { HomeCab } from "@/components/marketing/HomeCab";
import { HomePackages } from "@/components/marketing/HomePackages";
import { HomeServices } from "@/components/marketing/HomeServices";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, homeFaqs } from "@/content/faqs";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { phoneHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: {
    absolute: "Chauffeur Service in Colombo, Sri Lanka | Drivers Hub",
  },
  description:
    "Hire a professional chauffeur in Colombo with Drivers Hub. Designated-driver, airport, and day or night packages from LKR 1,800. WhatsApp 077 141 0588.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chauffeur Service in Colombo, Sri Lanka | Drivers Hub",
    description:
      "Hire a professional chauffeur in Colombo with Drivers Hub. Designated-driver, airport, and day or night packages from LKR 1,800.",
    url: "/",
  },
};

const figures = [
  { label: "Customers", value: "15,000+" },
  { label: "Rides", value: "150,000+" },
  { label: "Years on the road", value: "3+" },
  { label: "Night service", value: "24/7" },
];

const facts = [
  "Colombo, Sri Lanka",
  `Founded ${site.founded}`,
  "Vetted, ID’d chauffeurs",
  "Luxury and exotic makes",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <HomeMasthead />

      <HomeStats figures={figures} facts={facts} />

      <HomeServices />

      <HomeCab />

      <HomePackages />

      <HowItWorks />

      <WhyDriversHub />

      <TestimonialQuotes items={testimonials} />

      <HomeApp />

      <HomeFaq items={homeFaqs} />

      <SectionCard id="contact">
        <GlassCard className="dh-parallax flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Need a chauffeur tonight?
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">
              {site.address.line}. {site.hours.night}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={phoneHref()}>Call {site.phoneLocal}</Button>
            <Button
              href="/contact"
              variant="outline"
            >
              Contact page
            </Button>
          </div>
        </GlassCard>
      </SectionCard>
    </>
  );
}
