import { services } from "@/content/services";
import { InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { CabComingSoon } from "@/components/marketing/CabComingSoon";
import { ServiceTile } from "@/components/marketing/ServiceTile";
import { CtaRow } from "@/components/marketing/CtaRow";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Chauffeur services in Colombo",
  description:
    "Drivers Hub chauffeur services: day time, night, outstation, airport, heavy vehicle, and vehicle delivery. Call 077 141 0588.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <InnerPage>
      <PageIntro
        kicker="Services"
        title="Chauffeur services in Colombo"
        intro="Six chauffeur services, each with its own page. A Drivers Hub driver takes your car."
      />
      <div className="dh-parallax-grid mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceTile key={service.slug} service={service} />
        ))}
      </div>
      <div className="mt-10">
        <CabComingSoon />
      </div>
      <div className="mt-10">
        <CtaRow message="Hi Drivers Hub, I would like to book a chauffeur." />
      </div>
    </InnerPage>
  );
}
