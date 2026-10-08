import { SectionCard } from "@/components/layout/SectionCard";
import { site } from "@/content/site";

export function InnerPage({ children }: { children: React.ReactNode }) {
  return <SectionCard className="pb-8">{children}</SectionCard>;
}

export function PageIntro({
  kicker,
  title,
  intro,
}: {
  kicker?: string;
  title: string;
  intro: string;
}) {
  return (
    <header className="dh-stagger max-w-3xl">
      {kicker ? (
        <p className="text-sm font-medium tracking-[0.18em] text-ink-muted uppercase">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-ink-secondary">{intro}</p>
      <p className="sr-only">
        {site.name}, {site.address.line}
      </p>
    </header>
  );
}

export function BodyCopy({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="dh-stagger mt-8 max-w-3xl space-y-4 text-sm leading-7 text-ink-secondary">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}
