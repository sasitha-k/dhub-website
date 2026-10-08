"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "wait" | "play">("idle");

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => {
      setPhase("wait");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("play"));
      });
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          play();
          return;
        }

        setPhase("wait");
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className={cn(
        "dh-stagger-grid",
        phase === "play" && "is-in",
        phase === "wait" && "is-waiting",
        className,
      )}
    >
      {children}
    </div>
  );
}
