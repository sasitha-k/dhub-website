import type { Metadata } from "next";
import { InnerPage } from "@/components/marketing/PageIntro";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: {
    absolute: "Page not found | Drivers Hub",
  },
  description:
    "This Drivers Hub page does not exist. Return home, view chauffeur packages, or contact us on WhatsApp.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <InnerPage>
      <GlassCard className="p-8 md:p-10">
        <p className="text-sm font-medium tracking-[0.18em] text-ink-muted uppercase">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-ink-secondary">
          This URL is not a Drivers Hub page. You can return home, look at
          chauffeur packages, or contact us to book a driver.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/">Home</Button>
          <Button href="/packages" variant="outline">
            Packages
          </Button>
          <Button href="/contact" variant="outline">
            Contact
          </Button>
        </div>
      </GlassCard>
    </InnerPage>
  );
}
