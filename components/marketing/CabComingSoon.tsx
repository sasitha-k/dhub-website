import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { comingSoonService } from "@/content/services";

export function CabComingSoon() {
  return (
    <SurfaceCard className="dh-cab-card dh-parallax grid overflow-hidden md:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
      <div className="flex flex-col justify-center px-6 py-8 sm:px-8 md:py-12 md:pr-10 md:pl-10">
        <Badge className="w-fit">{comingSoonService.badge}</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Cab service
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink-secondary">
          A Drivers Hub cab brings the car to you. {comingSoonService.summary}{" "}
          Until then, a chauffeur drives the car you already own.
        </p>
        <div className="mt-6">
          <Button href="/app" variant="outline" size="sm">
            App status
          </Button>
        </div>
      </div>
      <div className="relative min-h-56 sm:min-h-64">
        <Image
          src="/cab-closed.jpg"
          alt="A black taxi with a roof sign parked along a Colombo street"
          fill
          sizes="(min-width: 768px) 46vw, 100vw"
          className="object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-white/40 to-transparent md:block" />
      </div>
    </SurfaceCard>
  );
}
