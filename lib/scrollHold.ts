export type ScrollHoldPhase = "free" | "hold" | "released";

export const SCROLL_SCENE_SELECTOR =
  ".dh-scroll-scene, .dh-why-scene, .dh-how-scene, .dh-services-scene, .dh-packages-scene, .dh-cab-scene";

export type PinAnchor = {
  y: number;
  bottom: number;
};

export type HoldGesture = "advance" | "leave" | "finish" | "latch" | "ignore";

export function freezeTargetY(blur?: Element | null) {
  const height = blur?.getBoundingClientRect().height ?? 72;
  return window.innerHeight - height - 48;
}

export function markScrollPhase(scene: HTMLElement, phase: ScrollHoldPhase) {
  const previous = scene.dataset.scrollPhase;
  scene.dataset.scrollPhase = phase;
  if (previous === "hold" && phase !== "hold") {
    queueMicrotask(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  }
}

export function isPassedHold(box: DOMRect) {
  return box.bottom < 64;
}

export function holdIsStale(box: DOMRect) {
  return isPassedHold(box) || box.top > window.innerHeight;
}

export function shouldLatchHold(box: DOMRect, target: number) {
  if (isPassedHold(box) || box.top >= window.innerHeight) return false;
  if (box.bottom <= target + 48) return true;
  return box.top <= 200;
}

export function shouldFinishMissed(box: DOMRect) {
  return isPassedHold(box);
}

export function shouldStartHold(
  scene: HTMLElement,
  box: DOMRect,
  target: number,
) {
  return shouldLatchHold(box, target) && isNextHold(scene, box);
}

export function takePinAnchor(card: HTMLElement): PinAnchor {
  return {
    y: window.scrollY,
    bottom: card.getBoundingClientRect().bottom,
  };
}

export function pinToHold(card: HTMLElement, target: number): PinAnchor {
  const box = card.getBoundingClientRect();
  const y = Math.max(0, window.scrollY + (box.bottom - target));
  if (Math.abs(y - window.scrollY) > 0.5) {
    window.scrollTo({ top: y, behavior: "instant" });
  }
  return {
    y,
    bottom: card.getBoundingClientRect().bottom,
  };
}

export function holdFromGesture(
  delta: number,
  scene: HTMLElement,
  card: HTMLElement,
  target: number,
  phase: ScrollHoldPhase,
  skipPin: boolean,
): HoldGesture {
  if (phase === "released") return "ignore";
  if (delta < 0) return phase === "hold" ? "leave" : "ignore";
  const box = card.getBoundingClientRect();
  if (phase === "hold") {
    if (holdIsStale(box)) return isPassedHold(box) ? "finish" : "leave";
    return "advance";
  }
  if (skipPin || phase !== "free") return "ignore";
  if (!shouldStartHold(scene, box, target)) return "ignore";
  return "latch";
}

let syncingPin = false;

export function syncPin(card: HTMLElement, anchor: PinAnchor) {
  if (syncingPin) return true;
  syncingPin = true;
  try {
    const bottom = card.getBoundingClientRect().bottom;
    const growth = bottom - anchor.bottom;
    if (growth > 0.5) {
      anchor.bottom = bottom;
      anchor.y += growth;
      window.scrollTo({ top: Math.max(0, anchor.y), behavior: "instant" });
      return true;
    }
    const drift = window.scrollY - anchor.y;
    if (drift < -24) return false;
    if (drift > 0.5) {
      window.scrollTo({ top: Math.max(0, anchor.y), behavior: "instant" });
    }
    return true;
  } finally {
    syncingPin = false;
  }
}

export function isNextHold(scene: HTMLElement, box: DOMRect) {
  if (box.top >= window.innerHeight || isPassedHold(box)) return false;
  const scenes = document.querySelectorAll<HTMLElement>(SCROLL_SCENE_SELECTOR);
  for (const other of scenes) {
    if (other === scene) continue;
    if (!other.classList.contains("is-live")) continue;
    const otherBox = other.getBoundingClientRect();
    if (otherBox.top >= box.top - 1) continue;
    if (otherBox.bottom < 64) continue;
    if (other.dataset.scrollPhase === "released") continue;
    return false;
  }
  return true;
}
