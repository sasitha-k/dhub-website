import Link from "next/link";
import { ArrowRight, Car, Moon, Plane, Route, Sun, Truck } from "lucide-react";
import { formatLkr } from "@/lib/format";
import type { ServicePackage } from "@/content/packages";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

const icons: Record<string, typeof Car> = {
  "night-distance": Route,
  "night-hourly": Moon,
  "day-time": Sun,
  airport: Plane,
  "long-trip": Car,
  "vehicle-delivery": Truck,
};

const washes = {
  night: "bg-[#581c87]/55 text-[#e9d5ff]",
  day: "bg-gold/22 text-gold",
  teal: "bg-[#134e4a]/50 text-[#99f6e4]",
  navy: "bg-[#1e3a8a]/50 text-[#bfdbfe]",
};

function washFor(item: ServicePackage) {
  if (item.period === "night") return washes.night;
  if (item.slug === "long-trip") return washes.teal;
  if (item.slug === "vehicle-delivery") return washes.navy;
  return washes.day;
}

export function PackageCard({
  item,
  showBadge = true,
}: {
  item: ServicePackage;
  showBadge?: boolean;
}) {
  const Icon = icons[item.slug] ?? Car;

  return (
    <Link
      href={item.href}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <GlassCard className="dh-package-card flex h-full flex-col p-[22px] transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full",
              washFor(item),
            )}
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="rounded-pill border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/80 uppercase">
            {item.rateChip}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight text-white">
            {item.name}
          </h3>
          {showBadge && item.teaser ? <Badge>Popular</Badge> : null}
        </div>
        <p className="mt-1.5 flex-1 text-sm leading-6 text-white/70">
          {item.summary}
        </p>
        {item.startingFromLkr != null ? (
          <p className="mt-6">
            <span className="block text-[0.68rem] font-medium tracking-[0.14em] text-white/45 uppercase">
              Starting from
            </span>
            <span className="mt-1 block text-[1.65rem] leading-none font-semibold tracking-tight text-price">
              {formatLkr(item.startingFromLkr)}
            </span>
          </p>
        ) : (
          <p className="mt-6 text-sm text-white/70">Contact for a quote</p>
        )}
        <span className="mt-5 flex items-center justify-between border-t border-white/12 pt-3 text-xs font-medium tracking-[0.14em] text-gold uppercase">
          View rates
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </GlassCard>
    </Link>
  );
}
