import { agreementIntro, agreementSections } from "@/content/agreement";
import { site } from "@/content/site";
import { InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { GlassCard } from "@/components/ui/GlassCard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Chauffeur agreement and terms",
  description:
    "Drivers Hub chauffeur agreement and policies in English and Sinhala. Vehicle documents, insurance, payments, safety, and belongings.",
  path: "/agreement",
});

export default function AgreementPage() {
  return (
    <InnerPage>
      <PageIntro
        kicker={agreementIntro.title}
        title="Drivers Hub chauffeur agreement"
        intro={`${agreementIntro.contactLine} This is the bilingual text from the current legal page, kept in English and Sinhala.`}
      />
      <p className="mt-6 text-base font-medium text-ink">
        {agreementIntro.sinhalaTitle}
      </p>
      <div className="mt-8 grid gap-4">
        {agreementSections.map((section, index) => (
          <GlassCard key={section.headingEn} className="p-6">
            <h2 className="text-lg font-semibold text-ink">
              {index + 1}. {section.headingEn} / {section.headingSi}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-secondary">{section.en}</p>
            <p className="mt-3 text-sm leading-7 text-ink-secondary">{section.si}</p>
          </GlassCard>
        ))}
      </div>
      <address className="mt-10 not-italic text-sm leading-7 text-ink-secondary">
        {site.address.line}
        <br />
        {site.email}
        <br />
        {site.phoneLocal}
      </address>
    </InnerPage>
  );
}
