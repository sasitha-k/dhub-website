"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";
import {
  freezeTargetY,
  holdFromGesture,
  holdIsStale,
  isPassedHold,
  markScrollPhase,
  pinToHold,
  shouldFinishMissed,
  shouldStartHold,
  syncPin,
  type PinAnchor,
} from "@/lib/scrollHold";

type Testimonial = {
  name: string;
  title: string;
  quote: string;
};

const GESTURE = 14;
const COOL_MS = 520;

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

export function TestimonialQuotes({ items }: { items: readonly Testimonial[] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const count = items.length;

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(count);
      return;
    }

    const card = scene.querySelector<HTMLElement>(".dh-scroll-card");
    const quotes = [...scene.querySelectorAll<HTMLElement>(".dh-scroll-item")];
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card) return;

    let phase: "free" | "hold" | "released" = "free";
    let anchor: PinAnchor = { y: 0, bottom: 0 };
    let shown = 0;
    let skipPin = false;
    let cooling = false;
    let coolTimer = 0;

    const cool = () => {
      cooling = true;
      window.clearTimeout(coolTimer);
      coolTimer = window.setTimeout(() => {
        cooling = false;
      }, COOL_MS);
    };

    const freezeTarget = () => freezeTargetY(blur);

    const mark = () => {
      markScrollPhase(scene, phase);
    };

    const pin = () => {
      if (phase !== "hold") return true;
      return syncPin(card, anchor);
    };

    const leaveUp = () => {
      skipPin = true;
      phase = shown >= count ? "released" : "free";
      mark();
    };

    const paintHold = (next: number) => {
      quotes.forEach((quote, index) => {
        const on = index < next;
        quote.style.opacity = on ? "1" : "0";
        quote.style.transform = on
          ? "none"
          : "translate3d(0, 1.35rem, 0) scale(0.96)";
        quote.toggleAttribute("inert", !on);
      });
      setRevealed(next);
    };

    const finish = () => {
      shown = count;
      phase = "released";
      mark();
      paintHold(count);
    };

    const apply = () => {
      const box = card.getBoundingClientRect();
      const target = freezeTarget();

      if (phase === "hold") {
        if (isPassedHold(box)) {
          finish();
          return;
        }
        if (holdIsStale(box) || !pin()) {
          leaveUp();
          return;
        }
        return;
      }

      if (phase === "released") {
        paintHold(count);
        return;
      }

      if (isPassedHold(box) || shouldFinishMissed(box)) {
        finish();
        return;
      }
      paintHold(shown);
      if (skipPin) {
        if (box.bottom > target + 8) skipPin = false;
        return;
      }
      if (shown < count && shouldStartHold(scene, box, target)) {
        phase = "hold";
        anchor = pinToHold(card, target);
        mark();
        paintHold(shown);
      }
    };

    const advanceHold = (delta: number) => {
      if (!pin()) {
        leaveUp();
        return;
      }
      if (cooling || Math.abs(delta) < GESTURE) return;

      if (shown < count) {
        shown += 1;
        paintHold(shown);
        cool();
        return;
      }
      phase = "released";
      mark();
    };

    const onWheel = (event: WheelEvent) => {
      const action = holdFromGesture(
        event.deltaY,
        scene,
        card,
        freezeTarget(),
        phase,
        skipPin,
      );
      if (action === "ignore") return;
      if (action === "leave") {
        leaveUp();
        return;
      }
      if (action === "finish") {
        finish();
        return;
      }
      event.preventDefault();
      if (action === "latch") {
        phase = "hold";
        anchor = pinToHold(card, freezeTarget());
        mark();
        paintHold(shown);
      }
      advanceHold(event.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchY;
      const delta = touchY - y;
      touchY = y;
      const action = holdFromGesture(
        delta,
        scene,
        card,
        freezeTarget(),
        phase,
        skipPin,
      );
      if (action === "ignore") return;
      if (action === "leave") {
        leaveUp();
        return;
      }
      if (action === "finish") {
        finish();
        return;
      }
      event.preventDefault();
      if (action === "latch") {
        phase = "hold";
        anchor = pinToHold(card, freezeTarget());
        mark();
        paintHold(shown);
      }
      advanceHold(delta);
    };

    const onKey = (event: KeyboardEvent) => {
      if (phase !== "hold") return;
      const down =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " ";
      const up = event.key === "ArrowUp" || event.key === "PageUp";
      if (!down && !up) return;
      if (up) {
        leaveUp();
        return;
      }
      event.preventDefault();
      advanceHold(GESTURE);
    };

    scene.classList.add("is-live");
    mark();
    apply();

    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(coolTimer);
      scene.classList.remove("is-live");
      delete scene.dataset.scrollPhase;
      quotes.forEach((quote) => {
        quote.removeAttribute("style");
        quote.removeAttribute("inert");
      });
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [count]);

  return (
    <div ref={sceneRef} id="testimonials" className="dh-scroll-scene dh-quotes-scene">
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
                    phase={index < revealed ? "play" : "wait"}
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
