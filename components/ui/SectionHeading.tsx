type SectionHeadingProps = {
  title: string;
  description?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  title,
  description,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <Tag className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {title}
      </Tag>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-ink-secondary">{description}</p>
      ) : null}
    </div>
  );
}
