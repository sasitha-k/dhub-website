import { notFound } from "next/navigation";
import { getPackage, packages } from "@/content/packages";
import { getService } from "@/content/services";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { BodyCopy, InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { CtaRow } from "@/components/marketing/CtaRow";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiblingLinks } from "@/components/marketing/SiblingLinks";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatLkr } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata, packageOfferJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return packages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const item = getPackage(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.title,
    description: item.description,
    path: item.href,
  });
}

export default async function PackageDetailPage({
  params,
}: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const item = getPackage(slug);
  if (!item) notFound();

  const relatedServices = item.relatedServiceSlugs
    .map((serviceSlug) => getService(serviceSlug))
    .filter((service) => service != null);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/packages" },
    { name: item.name, path: item.href },
  ];

  return (
    <InnerPage>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={packageOfferJsonLd(item)} />
      <Breadcrumbs
        items={crumbs.map((crumb) => ({ name: crumb.name, href: crumb.path }))}
      />
      <div className="mt-6">
        <PageIntro title={item.h1} intro={item.summary} />
      </div>
      {item.startingFromLkr != null ? (
        <p className="mt-6 text-sm">
          Starting from{" "}
          <span className="font-semibold text-price">
            {formatLkr(item.startingFromLkr)}
          </span>
          <span className="ml-2 text-ink-muted">
            Starting from · conditions apply
          </span>
        </p>
      ) : (
        <p className="mt-6 text-sm text-ink-secondary">
          No public starting price until the owner confirms delivery tiers.
        </p>
      )}
      <BodyCopy paragraphs={item.body} />
      {item.rates.length > 0 ? (
        <GlassCard className="mt-8 overflow-hidden">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{item.name} rates in LKR</caption>
            <thead className="bg-surface text-ink-secondary">
              <tr>
                <th className="px-5 py-3 font-medium">Cover</th>
                <th className="px-5 py-3 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {item.rates.map((rate) => (
                <tr key={rate.label} className="border-t border-line">
                  <td className="px-5 py-3">
                    {rate.label}
                    {rate.note ? (
                      <span className="mt-1 block text-xs text-ink-muted">
                        {rate.note}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 font-semibold text-price">
                    {formatLkr(rate.priceLkr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      ) : null}
      <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-ink-secondary">
        {item.conditions.map((condition) => (
          <li key={condition}>{condition}</li>
        ))}
      </ul>
      <div className="mt-10">
        <CtaRow
          message={`Hi Drivers Hub, I would like to book the ${item.name} package.`}
        />
      </div>
      <SiblingLinks
        title="Related services"
        items={relatedServices.map((service) => ({
          href: service.href,
          name: service.name,
        }))}
      />
      <SiblingLinks
        title="Other packages"
        items={[
          ...packages
            .filter((pack) => pack.slug !== item.slug)
            .map((pack) => ({ href: pack.href, name: pack.name })),
          { href: "/contact", name: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
