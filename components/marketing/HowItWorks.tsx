"use client";

import { useLayoutEffect, useRef } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  freezeTargetY,
  isNextHold,
  holdIsStale,
  isPassedHold,
  markScrollPhase,
  shouldFinishMissed,
  shouldLatchHold,
  syncPin,
  takePinAnchor,
  type PinAnchor,
} from "@/lib/scrollHold";

const steps = [
  {
    title: "Call or book",
    body: "Call, WhatsApp, or use the app when store links are public.",
  },
  {
    title: "Driver arrives",
    body: "An ID’d chauffeur meets you and your car.",
  },
  {
    title: "You ride in your car",
    body: "We drive. You stay in the vehicle you already own.",
  },
];

const LINES = 3;
const COUNT = steps.length;
const GESTURE = 14;
const COOL_MS = 520;

function placeDot(dot: HTMLElement, x: number, y: number) {
  dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

export function HowItWorks() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = scene.querySelector<HTMLElement>(".dh-how-card");
    const stage = scene.querySelector<HTMLElement>(".dh-how-stage");
    const panel = scene.querySelector<HTMLElement>(".dh-how-panel");
    const items = [...scene.querySelectorAll<HTMLElement>(".dh-step")];
    const dots = [...scene.querySelectorAll<HTMLElement>(".dh-how-dots .dh-step-dot")];
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card || !stage || !panel) return;

    let phase: "free" | "hold" | "released" = "free";
    let anchor: PinAnchor = { y: 0, bottom: 0 };
    let revealed = 0;
    let skipPin = false;
    let cooling = false;
    let coolTimer = 0;
    let primed = false;

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
      phase = revealed >= COUNT ? "released" : "free";
      mark();
    };

    const layoutDots = (count: number) => {
      if (!primed) stage.classList.add("is-placing");
      const stageBox = stage.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const dropY = panelBox.top - stageBox.top - 12;

      dots.forEach((dot) => {
        const step = Number(dot.dataset.step);
        const line = Number(dot.dataset.line);
        const on = step < count;
        const item = items[step];
        if (!item) return;
        const anchor = item.querySelector<HTMLElement>(
          `.dh-step-anchor[data-line="${line}"]`,
        );
        if (!anchor) return;
        const box = anchor.getBoundingClientRect();
        const x = box.left - stageBox.left;
        placeDot(dot, x, on ? box.top - stageBox.top : dropY);
        dot.classList.toggle("is-on", on);
      });

      if (!primed) {
        requestAnimationFrame(() => {
          stage.classList.remove("is-placing");
          primed = true;
        });
      }
    };

    const paintHold = (count: number) => {
      items.forEach((item, index) => {
        item.classList.toggle("is-on", index < count);
      });
      layoutDots(count);
    };

    const finish = () => {
      revealed = COUNT;
      phase = "released";
      mark();
      paintHold(COUNT);
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
        paintHold(COUNT);
        return;
      }

      if (isPassedHold(box) || shouldFinishMissed(box)) {
        finish();
        return;
      }
      paintHold(revealed);
      if (skipPin) {
        if (box.bottom > target + 8) skipPin = false;
        return;
      }
      if (
        revealed < COUNT &&
        shouldLatchHold(box, target) &&
        isNextHold(scene, box)
      ) {
        phase = "hold";
        anchor = takePinAnchor(card);
        mark();
        paintHold(revealed);
      }
    };

    const advanceHold = (delta: number) => {
      if (!pin()) {
        leaveUp();
        return;
      }
      if (cooling || Math.abs(delta) < GESTURE) return;

      if (revealed < COUNT) {
        revealed += 1;
        paintHold(revealed);
        cool();
        return;
      }
      phase = "released";
      mark();
    };

    const onWheel = (event: WheelEvent) => {
      if (phase !== "hold") return;
      if (holdIsStale(card.getBoundingClientRect())) {
        if (isPassedHold(card.getBoundingClientRect())) finish();
        else leaveUp();
        return;
      }
      if (event.deltaY < 0) {
        leaveUp();
        return;
      }
      event.preventDefault();
      advanceHold(event.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (phase !== "hold") return;
      const y = event.touches[0]?.clientY ?? touchY;
      const delta = touchY - y;
      touchY = y;
      if (delta < 0) {
        leaveUp();
        return;
      }
      event.preventDefault();
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
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={sceneRef} id="how-it-works" className="dh-how-scene">
      <SectionCard className="dh-how-card overflow-visible">
        <h2 className="px-1 text-2xl font-semibold tracking-tight text-ink">
          How it works
        </h2>
        <div className="dh-how-stage relative mt-5">
          <div className="dh-how-dots" aria-hidden="true">
            {steps.flatMap((step, stepIndex) =>
              Array.from({ length: LINES }, (_, line) => (
                <span
                  key={`${step.title}-${line}`}
                  className={`dh-step-dot dh-step-dot--${line}`}
                  data-step={stepIndex}
                  data-line={line}
                />
              )),
            )}
          </div>
          <GlassCard className="dh-how-panel rounded-[22px] px-6 py-2 sm:px-10">
            <ol className="dh-steps grid md:grid-cols-3">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  data-step={index}
                  className="dh-step relative py-8 md:px-10 md:py-12 first:md:pl-0 last:md:pr-0"
                >
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-line md:inset-y-8 md:inset-x-auto md:left-0 md:h-auto md:w-px"
                    />
                  ) : null}
                  <div className="dh-step-line dh-step-line--num">
                    <span className="dh-step-anchor" data-line="0" />
                    <p className="dh-step-copy text-3xl font-semibold tracking-tight text-ink-teal tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <span className="dh-step-rule mt-4 block h-px w-8 bg-ink-teal/30" />
                  <div className="dh-step-line dh-step-line--title mt-5">
                    <span className="dh-step-anchor" data-line="1" />
                    <h3 className="dh-step-copy text-lg font-semibold tracking-tight text-ink-teal">
                      {step.title}
                    </h3>
                  </div>
                  <div className="dh-step-line dh-step-line--body mt-2">
                    <span className="dh-step-anchor" data-line="2" />
                    <p className="dh-step-copy max-w-sm text-sm leading-6 text-pretty text-ink-teal/85">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
        </div>
      </SectionCard>
    </div>
  );
}
