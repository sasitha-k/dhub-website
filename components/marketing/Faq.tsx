import type { FaqItem } from "@/content/faqs";
import { GlassCard } from "@/components/ui/GlassCard";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="dh-parallax-grid grid gap-3">
      {items.map((item) => (
        <GlassCard as="article" key={item.question} className="p-5">
          <h3 className="text-base font-semibold text-ink">{item.question}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-secondary">{item.answer}</p>
        </GlassCard>
      ))}
    </div>
  );
}
