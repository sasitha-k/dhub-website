import type { Metadata } from "next";
import type { ChauffeurRole } from "@/content/careers";
import { site } from "@/content/site";
import type { ServicePackage } from "@/content/packages";
import type { HubService } from "@/content/services";

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = path;
  const fullTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      locale: "en_LK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phoneE164,
        foundingDate: site.foundingDate,
        sameAs: [site.social.facebook, site.social.instagram],
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          addressCountry: site.address.countryCode,
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#localbusiness`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phoneE164,
        priceRange: "LKR",
        parentOrganization: { "@id": `${site.url}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          addressCountry: site.address.countryCode,
        },
        areaServed: [
          { "@type": "City", name: "Colombo" },
          { "@type": "AdministrativeArea", name: "Western Province" },
          { "@type": "Country", name: "Sri Lanka" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}

const areaServed = [
  { "@type": "City", name: "Colombo" },
  { "@type": "AdministrativeArea", name: "Western Province" },
  { "@type": "Country", name: "Sri Lanka" },
];

export function serviceJsonLd(service: HubService) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: new URL(service.href, site.url).toString(),
    provider: { "@id": `${site.url}/#localbusiness` },
    areaServed,
  };
}

export function jobPostingJsonLd(role: ChauffeurRole) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: role.schemaDescription,
    datePosted: role.datePosted,
    validThrough: role.validThrough,
    employmentType: "OTHER",
    directApply: true,
    url: new URL(role.href, site.url).toString(),
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      sameAs: site.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: site.address.countryCode,
      },
    },
  };
}

export function packageOfferJsonLd(item: ServicePackage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.name,
    description: item.summary,
    url: new URL(item.href, site.url).toString(),
    provider: { "@id": `${site.url}/#localbusiness` },
    areaServed,
    offers:
      item.startingFromLkr == null
        ? undefined
        : {
            "@type": "Offer",
            priceCurrency: "LKR",
            price: item.startingFromLkr,
            url: new URL(item.href, site.url).toString(),
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "LKR",
              price: item.startingFromLkr,
            },
          },
  };
}
