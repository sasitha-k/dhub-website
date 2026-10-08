"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionCard } from "@/components/layout/SectionCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomeHero } from "@/components/marketing/HomeHero";
import { HomeIntro } from "@/components/marketing/HomeIntro";
import { cn } from "@/lib/cn";

const SCALE_REST = 1;
const SCALE_PINNED = 0.9;
const RADIUS_REST = 28;
const RADIUS_PINNED = 56;

function pinTop() {
  const frame = document.querySelector(".dh-page-frame");
  const card = document.querySelector(".dh-masthead");
  const frameStyle = frame ? getComputedStyle(frame) : null;
  const padT = frameStyle ? Number.parseFloat(frameStyle.paddingTop) : 12;
  const borderT = card
    ? Number.parseFloat(getComputedStyle(card).borderTopWidth) || 0
    : 0;
  return padT + borderT;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

export function HomeMasthead() {
  const cardRef = useRef<HTMLElement | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef(0);
  const allowSettle = useRef(true);
  const [ready, setReady] = useState(false);
  const [settle, setSettle] = useState(true);
  const [peeled, setPeeled] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    const slot = slotRef.current;
    const card = cardRef.current;
    if (!nav || !slot || !card) return;

    let framed = false;
    const place = () => {
      if (framed) return;
      framed = true;
      slot.style.height = `${nav.offsetHeight}px`;
      setReady(true);
    };

    if (prefersReducedMotion()) {
      place();
      return;
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.target === card && event.animationName === "dh-card-reveal") {
        place();
      }
    };
    card.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(place, 1100);
    return () => {
      card.removeEventListener("animationend", onEnd);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const slot = slotRef.current;
    const nav = navRef.current;
    const card = cardRef.current;
    if (!slot || !nav || !card) return;

    slot.style.height = `${nav.offsetHeight}px`;

    const paint = () => {
      const pinY = pinTop();
      const slotRect = slot.getBoundingClientRect();
      const range = Math.max(1, card.offsetHeight);
      const reduce = prefersReducedMotion();
      const peel = reduce
        ? slotRect.top < pinY
          ? 1
          : 0
        : clamp((pinY - slotRect.top) / range, 0, 1);

      nav.style.top = `${Math.max(pinY, slotRect.top)}px`;
      nav.style.left = `${slotRect.left}px`;
      nav.style.width = `${slotRect.width}px`;
      nav.style.transform = `scale(${lerp(SCALE_REST, SCALE_PINNED, peel)})`;
      nav.style.borderRadius = `${lerp(RADIUS_REST, RADIUS_PINNED, peel)}px`;
      nav.style.setProperty("--dh-nav-peel", peel.toFixed(4));
      const header = nav.querySelector("header");
      if (header instanceof HTMLElement) {
        header.style.paddingBottom = `${lerp(18, 10, peel)}px`;
      }

      peelRef.current = peel;
      const nextPeeled = peel > 0.02;
      if (nextPeeled !== nav.classList.contains("is-pinned")) {
        nav.classList.toggle("is-pinned", nextPeeled);
        if (nextPeeled && allowSettle.current) {
          allowSettle.current = false;
          setSettle(false);
        }
        setPeeled(nextPeeled);
      }
    };

    paint();
    window.addEventListener("scroll", paint, { passive: true });
    document.addEventListener("scroll", paint, { passive: true, capture: true });
    window.addEventListener("resize", paint);
    window.visualViewport?.addEventListener("scroll", paint);
    window.visualViewport?.addEventListener("resize", paint);
    return () => {
      window.removeEventListener("scroll", paint);
      document.removeEventListener("scroll", paint, true);
      window.removeEventListener("resize", paint);
      window.visualViewport?.removeEventListener("scroll", paint);
      window.visualViewport?.removeEventListener("resize", paint);
    };
  }, [ready]);

  const nav = (
    <div
      ref={navRef}
      className={cn("dh-masthead-nav", ready && "is-fixed", peeled && "is-pinned")}
    >
      <SiteHeader settle={settle && !peeled} />
    </div>
  );

  return (
    <SectionCard
      ref={cardRef}
      className={cn("dh-masthead", peeled && "is-pinned")}
    >
      <div ref={slotRef} className="dh-masthead-slot">
        {ready ? null : nav}
      </div>
      {ready ? createPortal(nav, document.body) : null}
      <div className="dh-masthead-body">
        <HomeIntro />
        <HomeHero />
      </div>
    </SectionCard>
  );
}
