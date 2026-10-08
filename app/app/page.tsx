import { CtaRow } from "@/components/marketing/CtaRow";
import { InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { GlassCard } from "@/components/ui/GlassCard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Get the Drivers Hub app",
  description:
    "The Drivers Hub customer app will list store, TestFlight, and APK links here when they are public. Book by call or WhatsApp today.",
  path: "/app",
});

export default function AppPage() {
  return (
    <InnerPage>
      <PageIntro
        kicker="Customer app"
        title="Get the Drivers Hub app"
        intro="Store, TestFlight, and APK buttons stay hidden until those links are real. Chauffeur bookings still go through a phone call or WhatsApp."
      />
      <GlassCard className="dh-parallax mt-8 max-w-2xl p-6">
        <p className="text-sm leading-6 text-ink-secondary">
          The live customer app uses the same marble and glass system as this
          site. Cab booking inside the app is marked coming soon. When public
          download links exist, they will be added on this page — not invented
          in the meantime.
        </p>
        <div className="mt-6">
          <CtaRow message="Hi Drivers Hub, I would like to book a chauffeur while the app links are not public yet." />
        </div>
      </GlassCard>
    </InnerPage>
  );
}
