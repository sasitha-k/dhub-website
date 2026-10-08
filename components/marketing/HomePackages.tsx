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
  pinToHold,
  syncPin,
  type PinAnchor,
} from "@/lib/scrollHold";

const CARD_COUNT = homeTeaserPackages.length;
const THROW_DISTANCE = 1.2;

type ThrowOffset = { dx: number; dy: number; rot: number };

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function unit(progress: number, start: number, end: number) {
  if (end === start) return progress >= end ? 1 : 0;
  return clamp((progress - start) / (end - start));
}

function easeOut(t: number) {
  return 1 - (1 - clamp(t)) ** 3;
}

export function HomePackages() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    const desktop = window.matchMedia("(min-width: 768px)");
    const card = scene.querySelector<HTMLElement>(".dh-packages-card");
    const head = scene.querySelector<HTMLElement>(".dh-packages-head");
    const more = scene.querySelector<HTMLElement>(".dh-packages-more");
    const inner = scene.querySelector<HTMLElement>(".dh-packages-more-inner");
    const cards = [
      ...scene.querySelectorAll<HTMLElement>(".dh-packages-scroll-item"),
    ];
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card || !head || !more || !inner || cards.length === 0) return;

    let phase: "free" | "hold" | "released" = "free";
    let anchor: PinAnchor = { y: 0, bottom: 0 };
    let throwT = 0;
    let opened = false;
    let skipPin = false;
    let live = false;
    let rowHeight = 0;
    const offsets: ThrowOffset[] = cards.map((_, index) => ({
      dx: -320 - index * 36,
      dy: (index - 1.5) * 12,
      rot: -18 + index * 6,
    }));

    const freezeTarget = () => freezeTargetY(blur);

    const mark = () => {
      markScrollPhase(scene, phase);
    };

    const pin = () => {
      if (phase !== "hold") return true;
      return syncPin(card, anchor);
    };

    const measure = () => {
      const previous = more.style.height;
      more.style.height = "auto";
      cards.forEach((item) => {
        item.style.transform = "none";
        item.style.opacity = "1";
      });
      rowHeight = Math.ceil(inner.scrollHeight);
      const stage = more.getBoundingClientRect();
      const originX = stage.left - 160;
      const originY = stage.top + Math.max(stage.height, rowHeight) / 2;
      cards.forEach((item, index) => {
        const box = item.getBoundingClientRect();
        offsets[index] = {
          dx: originX - (box.left + box.width / 2),
          dy: originY - (box.top + box.height / 2) + (index - 1.5) * 16,
          rot: -18 + index * 7,
        };
      });
      more.style.height = previous;
    };

    const expandFromView = () => {
      const box = card.getBoundingClientRect();
      if (box.top >= window.innerHeight || isPassedHold(box)) return 0;
      const target = freezeTarget();
      const headH = head.getBoundingClientRect().height;
      const room = target - box.top - headH;
      return clamp(room / Math.max(rowHeight, 1));
    };

    const paintCard = (
      node: HTMLElement,
      amount: number,
      offset: ThrowOffset,
    ) => {
      const t = easeOut(amount);
      node.style.opacity = String(t);
      node.style.transform =
        t >= 0.995
          ? "none"
          : `translate3d(${offset.dx * (1 - t)}px, ${offset.dy * (1 - t)}px, 0) rotate(${offset.rot * (1 - t)}deg) scale(${0.94 + t * 0.06})`;
      node.toggleAttribute("inert", t < 0.55);
    };

    const paintThrow = (amount: number) => {
      cards.forEach((item, index) => {
        paintCard(
          item,
          unit(amount, index / CARD_COUNT, (index + 1) / CARD_COUNT),
          offsets[index] ?? offsets[0],
        );
      });
    };

    const paintExpand = (expand: number) => {
      const open = opened || phase === "released" || throwT >= 1;
      scene.classList.toggle("is-open", open);
      const nextHeight = open ? "auto" : `${Math.round(rowHeight * expand)}px`;
      if (more.style.height !== nextHeight) more.style.height = nextHeight;
      more.toggleAttribute("inert", !open && expand < 0.12);
    };

    const finish = () => {
      opened = true;
      throwT = 1;
      phase = "released";
      scene.classList.add("is-open");
      mark();
      paintExpand(1);
      paintThrow(1);
    };

    const paint = () => {
      if (opened || phase === "released") {
        paintExpand(1);
        paintThrow(1);
        return;
      }
      if (phase === "hold") {
        paintExpand(1);
        paintThrow(throwT);
        return;
      }
      paintExpand(expandFromView());
      paintThrow(0);
    };

    const wholeSectionVisible = () => {
      const box = card.getBoundingClientRect();
      const target = freezeTarget();
      if (isPassedHold(box) || box.top >= window.innerHeight) return false;
      const expand = expandFromView();
      const headH = head.getBoundingClientRect().height;
      const fits = 64 + headH + rowHeight <= target + 8;
      if (fits) {
        return expand >= 0.995 && box.top > 56 && box.bottom <= target + 16;
      }
      return box.top <= 72 && expand >= 0.98;
    };

    const catchThrow = (from = 0) => {
      phase = "hold";
      throwT = from;
      skipPin = false;
      measure();
      paintExpand(1);
      anchor = pinToHold(card, freezeTarget());
      mark();
      paintThrow(throwT);
    };

    const apply = () => {
      if (!live) return;
      const box = card.getBoundingClientRect();
      const target = freezeTarget();

      if (opened || phase === "released") {
        paint();
        return;
      }

      if (isPassedHold(box)) {
        finish();
        return;
      }

      if (phase === "hold") {
        if (holdIsStale(box) || !pin()) finish();
        return;
      }

      paint();
      if (skipPin) {
        if (box.bottom > target + 8) skipPin = false;
        return;
      }
      if (wholeSectionVisible() && isNextHold(scene, box)) {
        catchThrow(0);
      }
    };

    const advanceThrow = (delta: number) => {
      if (delta < 0) {
        finish();
        return;
      }
      if (phase === "hold" && !pin()) {
        finish();
        return;
      }
      throwT = clamp(throwT + delta / (window.innerHeight * THROW_DISTANCE));
      paintThrow(throwT);
      if (throwT >= 1) finish();
    };

    const onWheel = (event: WheelEvent) => {
      if (!live || opened || phase === "released") return;
      const box = card.getBoundingClientRect();

      if (event.deltaY < 0) {
        if (phase === "hold") finish();
        return;
      }

      if (phase === "hold") {
        event.preventDefault();
        advanceThrow(event.deltaY);
        return;
      }

      if (skipPin) {
        skipPin = false;
        return;
      }
      if (wholeSectionVisible() && isNextHold(scene, box)) {
        event.preventDefault();
        catchThrow(0);
        advanceThrow(event.deltaY);
      }
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!live || opened || phase === "released") return;
      const y = event.touches[0]?.clientY ?? touchY;
      const delta = touchY - y;
      touchY = y;
      const box = card.getBoundingClientRect();
      if (delta < 0) {
        if (phase === "hold") finish();
        return;
      }
      if (phase === "hold") {
        event.preventDefault();
        advanceThrow(delta);
        return;
      }
      if (skipPin) {
        skipPin = false;
        return;
      }
      if (wholeSectionVisible() && isNextHold(scene, box)) {
        event.preventDefault();
        catchThrow(0);
        advanceThrow(delta);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (!live || opened || phase === "released") return;
      const down =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " ";
      const up = event.key === "ArrowUp" || event.key === "PageUp";
      if (!down && !up) return;
      const step =
        (event.key.startsWith("Page") ? 0.28 : 0.12) *
        window.innerHeight *
        THROW_DISTANCE;
      if (up) {
        if (phase === "hold") finish();
        return;
      }
      if (phase === "hold") {
        event.preventDefault();
        advanceThrow(step);
      }
    };

    const onResize = () => {
      if (!live) return;
      measure();
      paint();
      apply();
    };

    const stop = () => {
      if (!live) return;
      live = false;
      scene.classList.remove("is-live", "is-open");
      delete scene.dataset.scrollPhase;
      more.removeAttribute("style");
      more.removeAttribute("inert");
      cards.forEach((item) => {
        item.removeAttribute("style");
        item.removeAttribute("inert");
      });
      phase = "free";
      throwT = 0;
      opened = false;
    };

    const start = () => {
      if (live) return;
      live = true;
      phase = "free";
      throwT = 0;
      opened = false;
      scene.classList.add("is-live");
      mark();
      measure();
      apply();
    };

    const sync = () => {
      if (motionOk.matches && desktop.matches) start();
      else stop();
    };

    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    motionOk.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    sync();

    return () => {
      stop();
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      motionOk.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={sceneRef} id="packages" className="dh-packages-scene">
      <SectionCard className="dh-packages-card">
        <div className="dh-packages-head relative z-0 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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
        <div className="dh-packages-more">
          <div className="dh-packages-more-inner">
            <div className="dh-packages-row relative z-0 mt-[14px] grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
              {homeTeaserPackages.map((item) => (
                <div key={item.slug} className="dh-packages-scroll-item">
                  <PackageCard item={item} showBadge={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
