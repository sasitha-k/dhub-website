"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import type { FaqItem } from "@/content/faqs";
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

const GESTURE = 14;
const COOL_MS = 520;

function offStage(index: number) {
  const side = index % 2 === 0 ? -1 : 1;
  return `translate3d(${side * 4.5}rem, 0, 0)`;
}

export function HomeFaq({ items }: { items: FaqItem[] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = scene.querySelector<HTMLElement>(".dh-scroll-card");
    const rows = [...scene.querySelectorAll<HTMLElement>(".dh-scroll-item")];
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
      rows.forEach((row, index) => {
        const on = index < next;
        row.style.opacity = on ? "1" : "0";
        row.style.transform = on ? "none" : offStage(index);
        row.toggleAttribute("inert", !on);
      });
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
      rows.forEach((row) => {
        row.removeAttribute("style");
        row.removeAttribute("inert");
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
    <div ref={sceneRef} id="faq" className="dh-scroll-scene dh-faq-scene">
      <SectionCard className="dh-scroll-card">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">FAQ</h2>
        <div className="dh-scroll-more mt-6 overflow-hidden">
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
