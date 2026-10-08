import Link from "next/link";

export function SiblingLinks({
  title,
  items,
}: {
  title: string;
  items: Array<{ href: string; name: string }>;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex rounded-pill border border-line bg-card/80 px-3 py-2 text-sm text-ink hover:bg-surface"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
