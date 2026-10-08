"use client";

import { useRef } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { usePinnedItems } from "@/components/marketing/usePinnedItems";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FaqItem } from "@/content/faqs";

export function HomeFaq({ items }: { items: FaqItem[] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  usePinnedItems(sceneRef);

  return (
    <div ref={sceneRef} id="faq" className="dh-scroll-scene">
      <SectionCard className="dh-scroll-card">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">FAQ</h2>
        <div className="dh-scroll-more mt-6">
          <div className="dh-scroll-more-inner grid gap-3">
            {items.map((item) => (
              <div key={item.question} className="dh-scroll-item">
                <GlassCard as="article" className="p-5">
                  <h3 className="text-base font-semibold text-ink">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-secondary">
                    {item.answer}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
