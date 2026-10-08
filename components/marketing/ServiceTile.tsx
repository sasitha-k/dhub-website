import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { HubService } from "@/content/services";
import { cn } from "@/lib/cn";

function TileBody({
  name,
  summary,
  badge,
  showDetails,
  image,
}: {
  name: string;
  summary: string;
  badge?: string;
  showDetails?: boolean;
  image?: string;
}) {
  return (
    <SurfaceCard
      className={cn(
        "dh-service-tile relative flex h-full flex-col overflow-hidden px-6 py-7 text-left",
        image && "min-h-56 border-white/20 text-white",
      )}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1016]/92 via-[#0b1016]/45 to-[#0b1016]/35" />
        </>
      ) : null}
      <div className="relative z-10 flex flex-1 flex-col">
        {badge ? (
          <div className="flex justify-end">
            <Badge>{badge}</Badge>
          </div>
        ) : null}
        <div className={image ? "mt-auto pt-16" : "mt-5"}>
          <h3
            className={cn(
              "text-base font-semibold tracking-tight",
              image ? "text-white" : "text-ink",
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm leading-6",
              image ? "text-white/80" : "text-ink-secondary",
            )}
          >
            {summary}
          </p>
          {showDetails ? (
            <span
              className={cn(
                "mt-5 flex items-center justify-between border-t pt-3 text-xs font-medium tracking-[0.14em] uppercase",
                image ? "border-white/25 text-white" : "border-line text-brand",
              )}
            >
              View service
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          ) : null}
        </div>
      </div>
    </SurfaceCard>
  );
}

export function ServiceTile({
  service,
  comingSoon,
}: {
  service?: HubService;
  comingSoon?: { name: string; summary: string; badge: string };
}) {
  if (comingSoon) {
    return (
      <TileBody
        name={comingSoon.name}
        summary={comingSoon.summary}
        badge={comingSoon.badge}
      />
    );
  }

  if (!service) return null;

  return (
    <Link
      href={service.href}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <TileBody
        name={service.name}
        summary={service.summary}
        image={service.image}
        showDetails
      />
    </Link>
  );
}
