"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/layout/SectionCard";
import { ServiceTile } from "@/components/marketing/ServiceTile";
import { services } from "@/content/services";
import {
  freezeTargetY,
  isNextHold,
  holdIsStale,
  isPassedHold,
  markScrollPhase,
  shouldFinishMissed,
} from "@/lib/scrollHold";

const featured = services.slice(0, 3);
const more = services.slice(3);

const STEPS = 8;
const FIRST_END = 3 / STEPS;
const EXPAND_END = 4 / STEPS;
const HOLD_DISTANCE = 1.45 * (STEPS / 3);

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function unit(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

function paintCard(node: HTMLElement, amount: number) {
  const t = clamp(amount);
  node.style.opacity = String(t);
  node.style.transform = `translate3d(0, ${(1 - t) * 1.35}rem, 0) scale(${0.96 + t * 0.04})`;
  node.toggleAttribute("inert", t < 0.55);
}

export function HomeServices() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreInnerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const moreBox = moreRef.current;
    const moreInner = moreInnerRef.current;
    if (!scene || !moreBox || !moreInner) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const firstCards = [
      ...scene.querySelectorAll<HTMLElement>(
        ".dh-services-row--first > .dh-services-scroll-item",
      ),
    ];
    const secondCards = [
      ...scene.querySelectorAll<HTMLElement>(
        ".dh-services-row--more > .dh-services-scroll-item",
      ),
    ];

    const measuredHeight = () => Math.ceil(moreInner.scrollHeight);
    let moreHeight = measuredHeight();
    let phase: "free" | "hold" | "released" = "free";
    let freezeY = 0;
    let hold = 0;
    let skipPin = false;

    const extraHeight = (amount: number) =>
      amount > FIRST_END ? Math.ceil(moreHeight) : 0;

    const mark = () => {
      markScrollPhase(scene, phase);
    };

    const pin = () => {
      if (phase !== "hold") return;
      const box = card?.getBoundingClientRect();
      if (!box || holdIsStale(box) || window.scrollY < freezeY - 24) return;
      const y = freezeY + moreBox.getBoundingClientRect().height;
      if (Math.abs(window.scrollY - y) > 0.5) {
        window.scrollTo({ top: y, behavior: "instant" });
      }
    };

    let followExpand = 0;
    const followHeight = () => {
      if (phase !== "hold") return;
      cancelAnimationFrame(followExpand);
      const ends = performance.now() + 1200;
      const tick = (now: number) => {
        pin();
        if (now < ends) followExpand = requestAnimationFrame(tick);
      };
      followExpand = requestAnimationFrame(tick);
    };

    const paintHold = (amount: number) => {
      moreHeight = Math.max(moreHeight, measuredHeight());
      firstCards.forEach((card, index) => {
        paintCard(card, unit(amount, index / STEPS, (index + 1) / STEPS));
      });
      const expand = extraHeight(amount) > 0 ? 1 : 0;
      const nextHeight = `${extraHeight(amount)}px`;
      if (moreBox.style.height !== nextHeight) {
        moreBox.style.height = nextHeight;
        followHeight();
      }
      moreBox.toggleAttribute("inert", expand < 0.18);
      secondCards.forEach((card, index) => {
        paintCard(
          card,
          unit(
            amount,
            EXPAND_END + index / STEPS,
            EXPAND_END + (index + 1) / STEPS,
          ),
        );
      });
    };

    const card = scene.querySelector<HTMLElement>(".dh-services-card");
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");

    const freezeTarget = () => freezeTargetY(blur);

    const apply = () => {
      if (phase === "hold") {
        const held = card?.getBoundingClientRect();
        if (held && isPassedHold(held)) {
          hold = 1;
          phase = "released";
          mark();
          paintHold(1);
          return;
        }
        if ((held && holdIsStale(held)) || window.scrollY < freezeY - 24) {
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

      if (!card) return;
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
      const box = card?.getBoundingClientRect();
      if (box && holdIsStale(box)) {
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
      const step = event.key.startsWith("Page") ? 2 / STEPS : 1 / STEPS;
      advanceHold(step * window.innerHeight * HOLD_DISTANCE);
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
    const images = scene.querySelectorAll("img");
    images.forEach((image) => image.addEventListener("load", apply));

    return () => {
      scene.classList.remove("is-live");
      delete scene.dataset.scrollPhase;
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      images.forEach((image) => image.removeEventListener("load", apply));
    };
  }, []);

  return (
    <div ref={sceneRef} id="services" className="dh-services-scene">
      <SectionCard className="dh-services-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-medium tracking-[0.16em] text-brand uppercase">
              Services
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              Chauffeur services
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">
              A chauffeur drives your car, and you stay in the vehicle you
              already own.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand"
          >
            All services
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="dh-services-row dh-services-row--first mt-[14px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <div key={service.slug} className="dh-services-scroll-item">
              <ServiceTile service={service} />
            </div>
          ))}
        </div>
        <div ref={moreRef} className="dh-services-more">
          <div
            ref={moreInnerRef}
            className="dh-services-row dh-services-row--more pt-[14px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3"
          >
            {more.map((service) => (
              <div key={service.slug} className="dh-services-scroll-item">
                <ServiceTile service={service} />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
