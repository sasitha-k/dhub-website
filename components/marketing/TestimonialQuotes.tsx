"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";
import { usePinnedItems } from "@/components/marketing/usePinnedItems";

type Testimonial = {
  name: string;
  title: string;
  quote: string;
};

function TypeQuote({
  quote,
  delay,
  phase,
}: {
  quote: string;
  delay: number;
  phase: "idle" | "wait" | "play";
}) {
  const [shown, setShown] = useState(quote);
  const [caret, setCaret] = useState(false);

  useEffect(() => {
    if (phase !== "play") {
      setShown(phase === "wait" ? "" : quote);
      setCaret(false);
      return;
    }

    let cancelled = false;
    let interval = 0;
    setShown("");
    const start = window.setTimeout(() => {
      if (cancelled) return;
      setCaret(true);
      let index = 0;
      const step = Math.max(10, Math.min(20, 1600 / quote.length));
      interval = window.setInterval(() => {
        index += 1;
        setShown(quote.slice(0, index));
        if (index >= quote.length) {
          window.clearInterval(interval);
          setCaret(false);
        }
      }, step);
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [delay, phase, quote]);

  return (
    <blockquote className="relative mt-2 text-sm leading-6 text-ink-secondary">
      <span className="invisible" aria-hidden="true">
        {quote}
      </span>
      <span
        className={cn("absolute inset-0", caret && "dh-caret")}
        aria-hidden="true"
      >
        {shown}
      </span>
      <span className="sr-only">{quote}</span>
    </blockquote>
  );
}

function nextPhase(
  current: "idle" | "wait" | "play",
  amount: number,
): "idle" | "wait" | "play" {
  if (current === "play") return "play";
  if (amount >= 0.62) return "play";
  return "wait";
}

export function TestimonialQuotes({ items }: { items: readonly Testimonial[] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<Array<"idle" | "wait" | "play">>([]);
  const [phases, setPhases] = useState<Array<"idle" | "wait" | "play">>([]);

  if (phasesRef.current.length !== items.length) {
    phasesRef.current = items.map(() => "idle");
  }

  const onItem = useCallback((index: number, amount: number) => {
    const current = phasesRef.current[index] ?? "idle";
    const next = nextPhase(current, amount);
    if (current === next) return;
    const copy = phasesRef.current.slice();
    copy[index] = next;
    phasesRef.current = copy;
    setPhases(copy);
  }, []);

  usePinnedItems(sceneRef, onItem);

  return (
    <div ref={sceneRef} id="testimonials" className="dh-scroll-scene">
      <SectionCard className="dh-scroll-card">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          What clients say
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Quotes from the current public site, shown as testimonials.
        </p>
        <div className="dh-scroll-more mt-6">
          <div className="dh-scroll-more-inner grid gap-4 md:grid-cols-3">
            {items.map((item, index) => (
              <div key={item.name} className="dh-scroll-item">
                <GlassCard as="article" className="h-full p-5">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <TypeQuote
                    quote={item.quote}
                    delay={0}
                    phase={phases[index] ?? "idle"}
                  />
                  <p className="mt-4 text-xs text-ink-muted">{item.name}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
