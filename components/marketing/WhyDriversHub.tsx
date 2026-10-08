"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/layout/SectionCard";
import { Button } from "@/components/ui/Button";
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

const reasons = [
  {
    image: "/why/drink-glass.jpg",
    alt: "A crystal tumbler and a dark bottle on a wet table, with a rain-lit Colombo street behind them at night",
    position: "object-[62%_center]",
    kicker: "After a drink",
    title: "Leave the wheel",
    body: "Alcohol slows reaction time and narrows judgment. A short drive home can still end in a crash, an injury, a fine, or a licence you do not get back — for you, your passengers, and everyone else on that road. An ID’d Drivers Hub chauffeur takes your car, and you ride in it.",
  },
  {
    image: "/why/services.jpg",
    alt: "View from the rear seat at night, with a Drivers Hub chauffeur at the wheel on a wet Colombo road",
    position: "object-[center_40%]",
    kicker: "Your own car",
    title: "One standard of care",
    body: "The value does not change with the job. A vetted chauffeur drives the vehicle you already own, and you stay the passenger — a night home, a working day, the airport, a trip outside Colombo, a heavy vehicle, or a car that has to be delivered.",
  },
  {
    image: "/why/packages.jpg",
    alt: "A Drivers Hub chauffeur standing by an open rear door on a rain-wet, palm-lined street at night",
    position: "object-[70%_center]",
    kicker: "Every kind of trip",
    title: "Cover that fits",
    body: "A short hop, an evening on call, a full night, daytime hours, the airport, or a longer day out of town. You book the cover the trip actually needs, in the car you already keep.",
  },
] as const;

const COUNT = 2;
const GESTURE = 14;
const COOL_MS = 720;

export function WhyDriversHub() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = scene.querySelector<HTMLElement>(".dh-why-card");
    const photos = [...scene.querySelectorAll<HTMLElement>(".dh-why-item")];
    const more = scene.querySelector<HTMLElement>(".dh-why-more");
    const moreInner = scene.querySelector<HTMLElement>(".dh-why-more-inner");
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card || !more || !moreInner) return;

    let phase: "free" | "hold" | "released" = "free";
    let anchor: PinAnchor = { y: 0, bottom: 0 };
    let revealed = 0;
    let skipPin = false;
    let cooling = false;
    let coolTimer = 0;
    const measuredHeight = () => Math.ceil(moreInner.scrollHeight);
    let moreHeight = measuredHeight();
    let followExpand = 0;

    const cool = () => {
      cooling = true;
      window.clearTimeout(coolTimer);
      coolTimer = window.setTimeout(() => {
        cooling = false;
      }, COOL_MS);
    };

    const mark = () => {
      markScrollPhase(scene, phase);
    };

    const freezeTarget = () => freezeTargetY(blur);

    const extraHeight = (count: number) =>
      count >= 2 ? Math.ceil(moreHeight) : 0;

    const pin = () => {
      if (phase !== "hold") return true;
      return syncPin(card, anchor);
    };

    const leaveUp = () => {
      cancelAnimationFrame(followExpand);
      skipPin = true;
      phase = revealed >= COUNT ? "released" : "free";
      mark();
    };

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

    const paintHold = (count: number) => {
      moreHeight = Math.max(moreHeight, measuredHeight());
      photos.forEach((photo) => {
        const on = count >= 1;
        photo.style.opacity = on ? "1" : "0";
        photo.style.transform = on
          ? "none"
          : "translate3d(0, 1.35rem, 0) scale(0.96)";
        photo.toggleAttribute("inert", !on);
      });
      const nextHeight = `${extraHeight(count)}px`;
      if (more.style.height !== nextHeight) {
        more.style.height = nextHeight;
        followHeight();
      }
      more.toggleAttribute("inert", count < 2);
      scene.classList.toggle("is-copy-in", count >= 2);
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
    const images = scene.querySelectorAll("img");
    images.forEach((image) => image.addEventListener("load", apply));

    return () => {
      window.clearTimeout(coolTimer);
      cancelAnimationFrame(followExpand);
      more.removeAttribute("style");
      scene.classList.remove("is-live", "is-copy-in");
      delete scene.dataset.scrollPhase;
      photos.forEach((photo) => {
        photo.removeAttribute("style");
        photo.removeAttribute("inert");
      });
      more.removeAttribute("inert");
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
    <div ref={sceneRef} id="about" className="dh-why-scene">
      <SectionCard className="dh-why-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-medium tracking-[0.16em] text-brand uppercase">
              Why us
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              A chauffeur when the wheel should not be yours
            </h2>
            <p className="mt-2 text-sm leading-6 text-pretty text-ink-secondary">
              Colombo since 2020. ID’d drivers, your own car, and a way home that
              does not put you behind the wheel.
            </p>
          </div>
          <Button href="/about" variant="outline" size="sm">
            About us
            <ArrowRight size={14} aria-hidden="true" />
          </Button>
        </div>

        <div className="dh-why-photos mt-[14px] grid gap-[14px] md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="dh-why-item">
              <GlassCard className="overflow-hidden">
                <div className="relative h-56 sm:h-64">
                  <Image
                    src={reason.image}
                    alt={reason.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`object-cover ${reason.position}`}
                  />
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        <div className="dh-why-more">
          <div className="dh-why-more-inner pt-[14px] grid gap-[14px] md:grid-cols-3">
            {reasons.map((reason) => (
              <GlassCard key={reason.title} className="dh-why-copy-card px-6 py-7">
                <p className="text-[0.68rem] font-medium tracking-[0.16em] text-brand uppercase">
                  {reason.kicker}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-pretty text-ink-secondary">
                  {reason.body}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
