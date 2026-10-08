import Link from "next/link";
import { Faq } from "@/components/marketing/Faq";
import { InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { PackageCard } from "@/components/marketing/PackageCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, packageFaqs } from "@/content/faqs";
import { packages, packagesByPeriod, type PackagePeriod } from "@/content/packages";
import { cn } from "@/lib/cn";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Day and night chauffeur packages",
  description:
    "Drivers Hub chauffeur packages in Colombo: night distance from LKR 1,800, night hourly from LKR 2,500, daytime from LKR 3,000. Conditions apply.",
  path: "/packages",
});

const filters: Array<{ href: string; label: string; value: "all" | PackagePeriod }> =
  [
    { href: "/packages", label: "All", value: "all" },
    { href: "/packages?period=night", label: "Night", value: "night" },
    { href: "/packages?period=day", label: "Day", value: "day" },
  ];

export default async function PackagesPage({
  searchParams,
}: PageProps<"/packages">) {
  const { period } = await searchParams;
  const active: "all" | PackagePeriod =
    period === "night" || period === "day" ? period : "all";
  const items = packagesByPeriod(active);

  return (
    <InnerPage>
      <JsonLd data={faqJsonLd(packageFaqs)} />
      <PageIntro
        kicker="Packages"
        title="Day and night chauffeur packages"
        intro="Live homepage rates, starting from. Night distance, night hourly, daytime hours, airport, long trip, and vehicle delivery. Conditions apply."
      />
      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.href}
            className={cn(
              "rounded-pill border px-4 py-2 text-sm",
              active === filter.value
                ? "border-brand bg-brand text-white"
                : "border-line bg-card/80 text-ink hover:bg-surface",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      <div className="dh-parallax-grid mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PackageCard key={item.slug} item={item} />
        ))}
      </div>
      {active === "all" ? (
        <p className="mt-6 text-sm text-ink-muted">
          {packages.length} packages. Night and day filters hide airport, long
          trip, and vehicle delivery unless you choose All.
        </p>
      ) : null}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">FAQ</h2>
        <div className="mt-6">
          <Faq items={packageFaqs} />
        </div>
      </section>
    </InnerPage>
  );
}
