"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { comingSoonService, getService } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { phoneHref, whatsappHref } from "@/lib/whatsapp";

const airport = getService("airport");

const slides = [
  {
    id: "chauffeur",
    src: "/hero-chauffeur.png",
    alt: "A Drivers Hub chauffeur standing beside a dark sedan on a rain-slick Colombo street at night",
    objectClass: "object-[72%_42%]",
    label: "Chauffeur",
  },
  {
    id: "airport",
    src: "/hero-airport.png",
    alt: "A Drivers Hub chauffeur waiting beside a dark sedan on a rain-slick airport road at night",
    objectClass: "object-[82%_42%]",
    label: "Airport",
  },
  {
    id: "cab",
    src: "/hero-cab.png",
    alt: "A Drivers Hub driver holding open the rear door of a dark sedan on a rain-slick Colombo street, cab service coming soon",
    objectClass: "object-[72%_40%]",
    label: "Cab",
  },
] as const;

const navBtn =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-white/20 bg-black/40 text-white backdrop-blur-xl hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function scrollBehavior() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "auto";
  }
  return "smooth";
}

export function HomeHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (!width) return;
    setIndex(Math.round(track.scrollLeft / width));
  }, []);

  const go = useCallback((delta: number) => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (!width) return;
    const current = Math.round(track.scrollLeft / width);
    const next = (current + delta + slides.length) % slides.length;
    track.scrollTo({
      left: next * width,
      behavior: scrollBehavior(),
    });
  }, []);

  const goTo = useCallback((slideIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: slideIndex * track.clientWidth,
      behavior: scrollBehavior(),
    });
  }, []);

  return (
    <section
      className="mt-[22px]"
      aria-roledescription="carousel"
      aria-label="Drivers Hub services"
    >
      <div className="dh-hero-scene dh-hero-load relative h-[320px] overflow-hidden rounded-hero bg-hero text-white shadow-glass sm:h-[400px]">
        <div
          ref={trackRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth scrollbar-none motion-reduce:scroll-auto"
          onScroll={syncIndex}
        >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            id={`hero-${slide.id}`}
            className={cn(
              "relative h-full w-full shrink-0 snap-start overflow-hidden",
              slideIndex === index && "dh-slide-active",
            )}
            aria-label={`${slideIndex + 1} of ${slides.length}: ${slide.label}`}
          >
            <div className="dh-hero-media absolute inset-0">
              <div className="dh-hero-zoom absolute inset-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={slideIndex === 0}
                  sizes="(min-width: 1180px) 1180px, 100vw"
                  className={cn(
                    "pointer-events-none object-cover",
                    slide.objectClass,
                  )}
                  draggable={false}
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />

            <div className="dh-hero-copy absolute inset-0 flex flex-col justify-end px-6 py-8 sm:px-10 sm:py-10">
              {slide.id === "chauffeur" ? (
                <>
                  <p className="text-[0.68rem] font-medium tracking-[0.16em] text-white/70 uppercase">
                    {site.tagline}
                  </p>
                  <p className="mt-2.5 max-w-xl text-base leading-[1.6] text-white/80">
                    Designated driver, airport, and day or night packages. You
                    stay in your car. We send a vetted chauffeur.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      href="/services"
                      variant="outline"
                      size="sm"
                      className="border-white/25 bg-white/90 text-ink hover:translate-y-0 hover:bg-white"
                    >
                      All services
                    </Button>
                    <Button
                      href="/app"
                      variant="outline"
                      size="sm"
                      className="border-white/25 bg-white/90 text-ink hover:translate-y-0 hover:bg-white"
                    >
                      Get the app
                    </Button>
                  </div>
                </>
              ) : null}

              {slide.id === "airport" ? (
                <>
                  <p className="text-sm font-medium tracking-[0.18em] text-white/70 uppercase">
                    Airport
                  </p>
                  <h2 className="mt-2.5 max-w-3xl text-2xl font-semibold tracking-tight">
                    Airport chauffeur to BIA
                  </h2>
                  <p className="mt-2.5 max-w-xl text-base leading-[1.6] text-white/80">
                    {airport?.summary} We send an ID’d chauffeur.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button href={phoneHref()} size="sm">
                      <Phone size={16} aria-hidden="true" />
                      Call {site.phoneLocal}
                    </Button>
                    <Button
                      href={whatsappHref(
                        "Hi Drivers Hub, I need an airport chauffeur to BIA.",
                      )}
                      size="sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon />
                      WhatsApp
                    </Button>
                    <Button
                      href="/services/airport"
                      variant="outline"
                      size="sm"
                      className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                    >
                      Airport service
                    </Button>
                  </div>
                </>
              ) : null}

              {slide.id === "cab" ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium tracking-[0.18em] text-white/70 uppercase">
                      {comingSoonService.name}
                    </p>
                    <Badge className="bg-white/15 text-white">
                      {comingSoonService.badge}
                    </Badge>
                  </div>
                  <h2 className="mt-2.5 max-w-3xl text-2xl font-semibold tracking-tight">
                    Cab booking in the app
                  </h2>
                  <p className="mt-2.5 max-w-xl text-base leading-[1.6] text-white/80">
                    {comingSoonService.summary} Until then, hire a chauffeur and
                    stay in your own car.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button href="/app" size="sm">
                      App status
                    </Button>
                    <Button
                      href="/services"
                      variant="outline"
                      size="sm"
                      className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                    >
                      View services
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={cn(
          "dh-hero-arrow absolute top-1/2 left-3 z-20 md:left-5",
          navBtn,
        )}
        aria-label="Previous slide"
        onClick={() => go(-1)}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cn(
          "dh-hero-arrow absolute top-1/2 right-3 z-20 md:right-5",
          navBtn,
        )}
        aria-label="Next slide"
        onClick={() => go(1)}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <div
        className="dh-hero-chrome absolute inset-x-0 bottom-5 z-20 flex justify-center px-4 md:bottom-8"
        role="tablist"
        aria-label="Banner slides"
      >
        <div className="flex items-center gap-2 rounded-pill border border-white/20 bg-brand/75 px-3 py-2 backdrop-blur-xl">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={slide.label}
              className={cn(
                "h-2.5 rounded-pill transition-all",
                slideIndex === index
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/70",
              )}
              onClick={() => goTo(slideIndex)}
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
