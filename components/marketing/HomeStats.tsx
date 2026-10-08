"use client";

import { useEffect, useRef, useState } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { cn } from "@/lib/cn";

type Figure = {
  label: string;
  value: string;
};

function parseCount(value: string) {
  if (value.includes("/")) return null;
  const suffix = value.endsWith("+") ? "+" : "";
  const target = Number(value.replace(/[+,]/g, ""));
  if (!Number.isFinite(target)) return null;
  return { target, suffix };
}

function formatCount(value: number, suffix: string) {
  return `${value.toLocaleString("en-US")}${suffix}`;
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

export function HomeStats({
  figures,
  facts,
}: {
  figures: readonly Figure[];
  facts: readonly string[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "play">("idle");
  const [shown, setShown] = useState(() => figures.map((item) => item.value));

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => setPhase("play");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        play();
        observer.disconnect();
      },
      { threshold: 0.28, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(panel);
    const fallback = window.setTimeout(play, 900);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (phase !== "play") return;

    const parsed = figures.map((item) => parseCount(item.value));
    const duration = 1600;
    let frame = 0;

    const tick = (now: number) => {
      if (!frame) frame = now;
      const progress = Math.min(1, (now - frame) / duration);
      const eased = easeOutExpo(progress);

      setShown(
        figures.map((item, index) => {
          const count = parsed[index];
          if (!count) return item.value;
          return formatCount(Math.round(count.target * eased), count.suffix);
        }),
      );

      if (progress < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [figures, phase]);

  return (
    <SectionCard className="dh-stat-panel">
      <div
        ref={panelRef}
        className={cn("dh-stat-stage", phase === "play" && "is-in")}
      >
        <dl className="dh-stat-grid grid grid-cols-2 gap-x-6 gap-y-8 px-3 py-4 sm:grid-cols-4 sm:px-6 sm:py-6">
        {figures.map((item, index) => (
          <div
            key={item.label}
            className="dh-stat-item flex flex-col"
          >
            <dt className="order-2 mt-2 text-[0.68rem] font-medium tracking-[0.16em] text-ink-muted uppercase">
              {item.label}
            </dt>
            <dd
              className="order-1 text-3xl font-semibold tracking-tight text-ink tabular-nums sm:text-4xl"
              aria-label={item.value}
            >
              <span aria-hidden="true">{shown[index]}</span>
              <span className="sr-only">{item.value}</span>
            </dd>
            <span className="dh-stat-rule order-3 mt-3" aria-hidden="true" />
          </div>
        ))}
        </dl>
        <p className="dh-stat-facts mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 px-3 text-sm leading-6 text-ink-secondary sm:px-6">
          {facts.map((fact, index) => (
            <span key={fact} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-ink-muted">
                  ·
                </span>
              ) : null}
              {fact}
            </span>
          ))}
        </p>
      </div>
    </SectionCard>
  );
}
