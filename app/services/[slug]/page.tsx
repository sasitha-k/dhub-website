import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { getPackage } from "@/content/packages";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { BodyCopy, InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { CtaRow } from "@/components/marketing/CtaRow";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiblingLinks } from "@/components/marketing/SiblingLinks";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.description,
    path: service.href,
  });
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedPackages = service.relatedPackageSlugs
    .map((item) => getPackage(item))
    .filter((item) => item != null);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: service.href },
  ];

  return (
    <InnerPage>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={serviceJsonLd(service)} />
      <Breadcrumbs
        items={crumbs.map((item) => ({ name: item.name, href: item.path }))}
      />
      <div className="mt-6">
        <PageIntro title={service.h1} intro={service.summary} />
      </div>
      <BodyCopy paragraphs={service.body} />
      <div className="mt-10">
        <CtaRow
          message={`Hi Drivers Hub, I would like to book the ${service.name} service.`}
        />
      </div>
      <SiblingLinks
        title="Related packages"
        items={relatedPackages.map((item) => ({
          href: item.href,
          name: item.name,
        }))}
      />
      <SiblingLinks
        title="Other services"
        items={[
          ...services
            .filter((item) => item.slug !== service.slug)
            .map((item) => ({ href: item.href, name: item.name })),
          { href: "/contact", name: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
