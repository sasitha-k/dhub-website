"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/layout/SectionCard";
import { PackageCard } from "@/components/marketing/PackageCard";
import { Button } from "@/components/ui/Button";
import { homeTeaserPackages } from "@/content/packages";
import {
  freezeTargetY,
  isNextHold,
  holdIsStale,
  isPassedHold,
  markScrollPhase,
  shouldFinishMissed,
} from "@/lib/scrollHold";

const COUNT = homeTeaserPackages.length;
const HOLD_DISTANCE = 1.35;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function hideOffset(node: HTMLElement) {
  const nav = document.querySelector(".dh-masthead-nav");
  const navBottom = nav?.getBoundingClientRect().bottom ?? 72;
  const box = node.getBoundingClientRect();
  return Math.max(0, box.top - navBottom + 18);
}

function paintCard(node: HTMLElement, shown: boolean, from = 0) {
  node.style.opacity = shown ? "1" : "0";
  node.style.transform = shown ? "none" : `translate3d(0, ${-from}px, 0)`;
  node.toggleAttribute("inert", !shown);
}

export function HomePackages() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = [
      ...scene.querySelectorAll<HTMLElement>(".dh-packages-scroll-item"),
    ];
    const card = scene.querySelector<HTMLElement>(".dh-packages-card");
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card) return;

    const fromByIndex: number[] = [];
    const shownAt = cards.map(() => false);
    let phase: "free" | "hold" | "released" = "free";
    let freezeY = 0;
    let hold = 0;
    let skipPin = false;

    const measure = () => {
      cards.forEach((item) => {
        item.style.transition = "none";
        item.style.transform = "none";
      });
      cards.forEach((item, index) => {
        fromByIndex[index] = hideOffset(item);
      });
      cards.forEach((item, index) => {
        item.style.transition = "";
        paintCard(item, shownAt[index] ?? false, fromByIndex[index] ?? 0);
      });
    };

    const freezeTarget = () => freezeTargetY(blur);

    const mark = () => {
      markScrollPhase(scene, phase);
    };

    const pin = () => {
      if (phase !== "hold") return;
      const box = card.getBoundingClientRect();
      if (holdIsStale(box) || window.scrollY < freezeY - 24) return;
      if (Math.abs(window.scrollY - freezeY) > 0.5) {
        window.scrollTo({ top: freezeY, behavior: "instant" });
      }
    };

    const paintHold = (amount: number) => {
      cards.forEach((item, index) => {
        const shown = amount >= (index + 0.2) / COUNT;
        if (shown === shownAt[index]) return;
        shownAt[index] = shown;
        paintCard(item, shown, fromByIndex[index] ?? 0);
      });
    };

    const apply = () => {
      if (phase === "hold") {
        const held = card.getBoundingClientRect();
        if (isPassedHold(held)) {
          hold = 1;
          phase = "released";
          mark();
          paintHold(1);
          return;
        }
        if (holdIsStale(held) || window.scrollY < freezeY - 24) {
          skipPin = true;
          phase = hold >= 1 ? "released" : "free";
          mark();
        }
        return;
      }

      if (phase === "released") {
        paintHold(1);
        return;
      }

      const box = card.getBoundingClientRect();
      const target = freezeTarget();
      if (isPassedHold(box) || shouldFinishMissed(box)) {
        hold = 1;
        phase = "released";
        mark();
        paintHold(1);
        return;
      }
      paintHold(hold);
      if (skipPin) {
        if (box.bottom > target + 8) skipPin = false;
        return;
      }
      if (hold < 1 && box.bottom <= target && isNextHold(scene, box)) {
        phase = "hold";
        mark();
        freezeY = window.scrollY;
        paintHold(hold);
      }
    };

    const advanceHold = (delta: number) => {
      if (delta < 0) {
        skipPin = true;
        phase = hold >= 1 ? "released" : "free";
        mark();
        return;
      }
      hold = clamp(hold + delta / (window.innerHeight * HOLD_DISTANCE));
      paintHold(hold);
      pin();
      if (hold >= 1) {
        phase = "released";
        mark();
      }
    };

    const leaveUp = () => {
      skipPin = true;
      phase = hold >= 1 ? "released" : "free";
      mark();
    };

    const onWheel = (event: WheelEvent) => {
      if (phase !== "hold") return;
      const box = card.getBoundingClientRect();
      if (holdIsStale(box)) {
        if (isPassedHold(box)) {
          hold = 1;
          phase = "released";
          mark();
          paintHold(1);
        } else leaveUp();
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
      const step = event.key.startsWith("Page") ? 2 / COUNT : 1 / COUNT;
      advanceHold(step * window.innerHeight * HOLD_DISTANCE);
    };

    const onResize = () => {
      measure();
      apply();
    };

    scene.classList.add("is-live");
    mark();
    measure();
    apply();

    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      scene.classList.remove("is-live");
      delete scene.dataset.scrollPhase;
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={sceneRef} id="packages" className="dh-packages-scene">
      <SectionCard className="dh-packages-card">
        <div className="relative z-0 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[0.68rem] font-medium tracking-[0.16em] text-brand uppercase">
              Packages
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Popular packages
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">
              Live homepage rates, starting from. Conditions apply.
            </p>
          </div>
          <Button href="/packages" variant="outline" size="sm">
            All packages
            <ArrowRight size={14} aria-hidden="true" />
          </Button>
        </div>
        <div className="dh-packages-row relative z-0 mt-[14px] grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
          {homeTeaserPackages.map((item) => (
            <div key={item.slug} className="dh-packages-scroll-item">
              <PackageCard item={item} showBadge={false} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
