"use client";

import { usePathname } from "next/navigation";
import { SectionCard } from "@/components/layout/SectionCard";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function LayoutHeader() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="sticky top-3 z-50 md:top-4">
      <SectionCard as="div">
        <SiteHeader dense />
      </SectionCard>
    </div>
  );
}
