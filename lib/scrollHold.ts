export type ScrollHoldPhase = "free" | "hold" | "released";

export const SCROLL_SCENE_SELECTOR =
  ".dh-scroll-scene, .dh-why-scene, .dh-how-scene, .dh-services-scene, .dh-packages-scene, .dh-cab-scene";

export type PinAnchor = {
  y: number;
  bottom: number;
};

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
  if (box.top <= 48 || box.top >= window.innerHeight) return false;
  if (box.bottom <= 64) return false;
  if (box.bottom <= target) return true;
  return box.top <= 120;
}

export function shouldFinishMissed(box: DOMRect) {
  return box.top <= 48 && box.bottom > 64;
}

export function takePinAnchor(card: HTMLElement): PinAnchor {
  return {
    y: window.scrollY,
    bottom: card.getBoundingClientRect().bottom,
  };
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
    if (drift < -24 || drift > 48) return false;
    return true;
  } finally {
    syncingPin = false;
  }
}

export function isNextHold(scene: HTMLElement, box: DOMRect) {
  if (box.top >= window.innerHeight || box.top <= 48) return false;
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
