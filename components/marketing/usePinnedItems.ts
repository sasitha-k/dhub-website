"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
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

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function unit(progress: number, start: number, end: number) {
  if (end === start) return progress >= end ? 1 : 0;
  return clamp((progress - start) / (end - start));
}

function paintCard(node: HTMLElement, amount: number, collapse: boolean) {
  const t = clamp(amount);
  node.style.opacity = String(t);
  node.style.transform = collapse
    ? "none"
    : `translate3d(0, ${(1 - t) * 1.35}rem, 0) scale(${0.96 + t * 0.04})`;
  node.toggleAttribute("inert", t < 0.55);
}

function clearItem(node: HTMLElement) {
  node.style.opacity = "";
  node.style.transform = "";
  node.removeAttribute("inert");
}

export function usePinnedItems(
  sceneRef: RefObject<HTMLElement | null>,
  onItem?: (index: number, amount: number) => void,
) {
  const onItemRef = useRef(onItem);
  onItemRef.current = onItem;

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = scene.querySelector<HTMLElement>(".dh-scroll-card");
    const more = scene.querySelector<HTMLElement>(".dh-scroll-more");
    const inner = scene.querySelector<HTMLElement>(".dh-scroll-more-inner");
    const items = [...scene.querySelectorAll<HTMLElement>(".dh-scroll-item")];
    const blur = document.querySelector<HTMLElement>(".dh-bottom-blur");
    if (!card || items.length === 0) return;

    const count = items.length;
    const holdDistance = Math.max(0.8, 1.35 * (count / 4));
    let phase: "free" | "hold" | "released" = "free";
    let anchor: PinAnchor = { y: 0, bottom: 0 };
    let hold = 0;
    let skipPin = false;
    let collapse = false;
    let spans: { start: number; end: number }[] = [];
    let alive = true;

    const freezeTarget = () => freezeTargetY(blur);

    const navBottom = () =>
      document.querySelector(".dh-masthead-nav")?.getBoundingClientRect()
        .bottom ?? 72;

    const measure = () => {
      if (more) {
        more.style.height = "";
        more.style.overflow = "";
      }
      items.forEach(clearItem);
      const available = freezeTarget() - navBottom() - 24;
      collapse = Boolean(more && inner) && card.offsetHeight > available;
      if (!collapse || !inner) {
        spans = [];
        return;
      }
      const innerTop = inner.getBoundingClientRect().top;
      spans = items.map((item) => {
        const box = item.getBoundingClientRect();
        return { start: box.top - innerTop, end: box.bottom - innerTop };
      });
    };

    const revealedHeight = (amount: number) => {
      let height = 0;
      items.forEach((_, index) => {
        const t = unit(amount, index / count, (index + 1) / count);
        const span = spans[index];
        if (!span || t <= 0) return;
        height = Math.max(height, span.start + (span.end - span.start) * t);
      });
      return Math.round(height);
    };

    const pin = () => {
      if (phase !== "hold") return true;
      return syncPin(card, anchor);
    };

    const leaveUp = () => {
      skipPin = true;
      phase = hold >= 1 ? "released" : "free";
      mark();
    };

    const paintHold = (amount: number) => {
      items.forEach((item, index) => {
        const t = unit(amount, index / count, (index + 1) / count);
        paintCard(item, t, collapse);
        onItemRef.current?.(index, t);
      });
      if (!collapse || !more) return;
      if (phase === "free") {
        more.style.height = "";
        more.style.overflow = "";
        return;
      }
      if (amount >= 1) {
        more.style.height = "";
        more.style.overflow = "";
        return;
      }
      more.style.overflow = "hidden";
      more.style.height = `${revealedHeight(amount)}px`;
    };

    const mark = () => {
      markScrollPhase(scene, phase);
    };

    const finish = () => {
      hold = 1;
      phase = "released";
      mark();
      paintHold(1);
    };

    const apply = () => {
      if (!alive) return;
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
        paintHold(1);
        return;
      }

      if (isPassedHold(box) || shouldFinishMissed(box)) {
        finish();
        return;
      }

      paintHold(hold);
      if (skipPin) {
        if (box.bottom > target + 8) skipPin = false;
        return;
      }
      if (hold < 1 && shouldLatchHold(box, target) && isNextHold(scene, box)) {
        phase = "hold";
        anchor = takePinAnchor(card);
        mark();
        paintHold(hold);
      }
    };

    const advanceHold = (delta: number) => {
      hold = clamp(hold + delta / (window.innerHeight * holdDistance));
      paintHold(hold);
      anchor = takePinAnchor(card);
      if (!pin()) {
        leaveUp();
        return;
      }
      if (hold >= 1) phase = "released";
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
      const step = event.key.startsWith("Page") ? 2 / count : 1 / count;
      advanceHold(step * window.innerHeight * holdDistance);
    };

    const onResize = () => {
      const current = phase;
      const currentHold = hold;
      measure();
      if (current === "released") paintHold(1);
      else if (current === "hold") paintHold(currentHold);
      else apply();
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

    document.fonts?.ready.then(() => {
      if (!alive || phase !== "free") return;
      measure();
      apply();
    });

    return () => {
      alive = false;
      scene.classList.remove("is-live");
      delete scene.dataset.scrollPhase;
      if (more) {
        more.style.height = "";
        more.style.overflow = "";
      }
      items.forEach(clearItem);
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [sceneRef]);
}
