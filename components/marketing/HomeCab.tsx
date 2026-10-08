"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { SectionCard } from "@/components/layout/SectionCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { comingSoonService } from "@/content/services";
import {
  freezeTargetY,
  isNextHold,
  holdIsStale,
  isPassedHold,
  markScrollPhase,
  shouldFinishMissed,
} from "@/lib/scrollHold";

const HOLD_DISTANCE = 1.15;
const IMAGE_END = 0.68;
const SPLIT = 0.52;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function HomeCab() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    const desktop = window.matchMedia("(min-width: 768px)");
    const card = scene.querySelector<HTMLElement>(".dh-cab-card");
    const media = scene.querySelector<HTMLElement>(".dh-cab-media");
    const copy = scene.querySelector<HTMLElement>(".dh-cab-copy");
    const fade = scene.querySelector<HTMLElement>(".dh-cab-media-fade");
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card || !media || !copy) return;

    let phase: "free" | "hold" | "released" = "free";
    let freezeY = 0;
    let hold = 0;
    let skipPin = false;
    let live = false;
    let image: HTMLImageElement | null = null;

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

    const paint = (amount: number) => {
      const t = clamp(amount);
      const imageT = t >= IMAGE_END ? 1 : t / IMAGE_END;
      const copyT = t > IMAGE_END ? 1 : 0;
      media.style.left = `${imageT * SPLIT * 100}%`;
      if (fade) fade.style.opacity = String(imageT);
      scene.classList.toggle("is-copy-in", copyT >= 1);
      copy.toggleAttribute("inert", copyT < 1);
    };

    const apply = () => {
      if (!live) return;
      if (phase === "hold") {
        const held = card.getBoundingClientRect();
        if (isPassedHold(held)) {
          hold = 1;
          phase = "released";
          mark();
          paint(1);
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
        paint(1);
        return;
      }

      const box = card.getBoundingClientRect();
      const target = freezeTarget();
      if (isPassedHold(box) || shouldFinishMissed(box)) {
        hold = 1;
        phase = "released";
        mark();
        paint(1);
        return;
      }
      paint(hold);
      if (skipPin) {
        if (box.bottom > target + 8) skipPin = false;
        return;
      }
      if (hold < 1 && box.bottom <= target && isNextHold(scene, box)) {
        phase = "hold";
        mark();
        freezeY = window.scrollY;
        paint(hold);
      }
    };

    const advanceHold = (delta: number) => {
      if (delta < 0) {
        skipPin = true;
        phase = hold >= 1 ? "released" : "free";
        mark();
        return;
      }
      const next = hold + delta / (window.innerHeight * HOLD_DISTANCE);
      hold = hold < IMAGE_END && next >= IMAGE_END ? IMAGE_END : clamp(next);
      paint(hold);
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
      if (!live || phase !== "hold") return;
      const box = card.getBoundingClientRect();
      if (holdIsStale(box)) {
        if (isPassedHold(box)) {
          hold = 1;
          phase = "released";
          mark();
          paint(1);
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
      if (!live || phase !== "hold") return;
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
      if (!live || phase !== "hold") return;
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
      const step = event.key.startsWith("Page") ? 0.55 : 0.28;
      advanceHold(step * window.innerHeight * HOLD_DISTANCE);
    };

    const stop = () => {
      if (!live) return;
      live = false;
      scene.classList.remove("is-live", "is-copy-in");
      delete scene.dataset.scrollPhase;
      media.removeAttribute("style");
      copy.removeAttribute("inert");
      fade?.removeAttribute("style");
      phase = "free";
      hold = 0;
    };

    const start = () => {
      if (live) return;
      live = true;
      phase = "free";
      hold = 0;
      scene.classList.add("is-live");
      mark();
      apply();
    };

    const sync = () => {
      if (motionOk.matches && desktop.matches) start();
      else stop();
    };

    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    image = media.querySelector("img");
    image?.addEventListener("load", apply);
    motionOk.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    sync();

    return () => {
      stop();
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      image?.removeEventListener("load", apply);
      motionOk.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={sceneRef} id="cab-service" className="dh-cab-scene">
      <SectionCard className="dh-cab-frame">
        <SurfaceCard className="dh-cab-card overflow-hidden">
          <div className="dh-cab-stage">
            <div className="dh-cab-copy flex flex-col justify-center px-6 py-8 sm:px-8 md:py-12 md:pr-10 md:pl-10">
              <Badge className="w-fit">{comingSoonService.badge}</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
                Cab service
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-ink-secondary">
                A Drivers Hub cab brings the car to you.{" "}
                {comingSoonService.summary} Until then, a chauffeur drives the
                car you already own.
              </p>
              <div className="mt-6">
                <Button href="/app" variant="outline" size="sm">
                  App status
                </Button>
              </div>
            </div>
            <div className="dh-cab-media">
              <Image
                src="/cab-closed.jpg"
                alt="A black taxi with a roof sign parked along a Colombo street"
                fill
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-cover object-center"
              />
              <div className="dh-cab-media-fade pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-white/40 to-transparent md:block" />
            </div>
          </div>
        </SurfaceCard>
      </SectionCard>
    </div>
  );
}
