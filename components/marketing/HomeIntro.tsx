import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site } from "@/content/site";
import { phoneHref, whatsappHref } from "@/lib/whatsapp";

const pillClass = "hover:translate-y-0";

export function HomeIntro() {
  return (
    <div className="dh-intro px-1.5">
      <p className="dh-intro-kicker mt-2 text-[0.68rem] font-medium tracking-[0.16em] text-ink-muted uppercase">
        {site.name} / {site.address.locality}
      </p>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="dh-intro-title text-[clamp(1.75rem,4vw,2.35rem)] font-semibold tracking-[-0.03em] leading-[1.15] text-ink">
          Professional chauffeurs in Colombo
        </h1>
        <p className="dh-intro-tag text-[0.95rem] text-ink-muted">
          {site.tagline}
        </p>
      </div>
      <div className="dh-intro-actions mt-[18px] flex flex-wrap gap-2">
        <Button href={phoneHref()} size="sm" className={pillClass}>
          <Phone size={16} aria-hidden="true" />
          Call {site.phoneLocal}
        </Button>
        <Button
          href={whatsappHref(
            "Hi Drivers Hub, I would like to book a chauffeur.",
          )}
          size="sm"
          className={pillClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          WhatsApp
        </Button>
        <Button
          href="/packages"
          variant="outline"
          size="sm"
          className={pillClass}
        >
          View packages
        </Button>
      </div>
    </div>
  );
}
