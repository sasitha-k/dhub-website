import Link from "next/link";
import { ChauffeurApplyForm } from "@/components/marketing/ChauffeurApplyForm";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CtaRow } from "@/components/marketing/CtaRow";
import { BodyCopy, InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { applyIntro, chauffeurRole } from "@/content/careers";
import { site } from "@/content/site";
import { breadcrumbJsonLd, buildMetadata, jobPostingJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Chauffeur jobs in Colombo",
  description:
    "Apply as a Drivers Hub chauffeur in Colombo. Interview, identity card, night and day shifts driving the client’s car. WhatsApp 077 141 0588.",
  path: "/careers",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
];

export default function CareersPage() {
  return (
    <InnerPage>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={jobPostingJsonLd(chauffeurRole)} />
      <Breadcrumbs
        items={crumbs.map((item) => ({ name: item.name, href: item.path }))}
      />
      <div className="mt-6">
        <PageIntro
          kicker="Careers"
          title="Chauffeur jobs in Colombo"
          intro={chauffeurRole.summary}
        />
      </div>
      <BodyCopy paragraphs={[...chauffeurRole.paragraphs]} />
      <div className="dh-parallax-grid mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="space-y-6">
          <GlassCard as="section" className="p-6">
            <SectionHeading title="The role" />
            <dl className="mt-4 space-y-2 text-sm text-ink-secondary">
              <div className="flex gap-2">
                <dt className="font-medium text-ink">Where</dt>
                <dd>{chauffeurRole.location}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-ink">Office</dt>
                <dd>{site.address.line}</dd>
              </div>
            </dl>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-secondary">
              {chauffeurRole.youWill.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard as="section" className="p-6">
            <SectionHeading
              title="What we look for"
              description="Bring these to the interview. Pay is discussed then."
            />
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-ink-secondary">
              {chauffeurRole.weLookFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-ink-secondary">
              Read the{" "}
              <Link className="underline" href="/agreement">
                agreement
              </Link>{" "}
              for how jobs run, and{" "}
              <Link className="underline" href="/about">
                about Drivers Hub
              </Link>{" "}
              if you want the company story first.
            </p>
          </GlassCard>
          <CtaRow message="Hi Drivers Hub, I would like to apply as a chauffeur." />
        </div>
        <GlassCard as="section" id="apply" className="h-fit scroll-mt-28 p-6">
          <h2 className="text-lg font-semibold text-ink">Apply as a chauffeur</h2>
          <p className="mt-2 text-sm text-ink-secondary">{applyIntro}</p>
          <div className="mt-6">
            <ChauffeurApplyForm />
          </div>
        </GlassCard>
      </div>
    </InnerPage>
  );
}
