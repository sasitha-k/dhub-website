"use client";

import { useRef } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { usePinnedItems } from "@/components/marketing/usePinnedItems";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function HomeApp() {
  const sceneRef = useRef<HTMLDivElement>(null);
  usePinnedItems(sceneRef);

  return (
    <div ref={sceneRef} id="app" className="dh-scroll-scene">
      <SectionCard className="dh-scroll-card">
        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Get the app
          </h2>
          <div className="dh-scroll-more mt-2">
            <div className="dh-scroll-more-inner">
              <div className="dh-scroll-item">
                <p className="text-sm leading-6 text-ink-secondary">
                  Public store links are not up yet. Call or WhatsApp to book, and
                  check the app page later for downloads.
                </p>
              </div>
              <div className="dh-scroll-item">
                <Button href="/app" variant="outline" size="sm" className="mt-5">
                  App status
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </SectionCard>
    </div>
  );
}
