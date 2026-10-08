import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/content/site";
import { phoneHref, whatsappHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/layout/BrandMark";
import { HeaderMenu } from "@/components/layout/HeaderMenu";
import { NavLinks } from "@/components/layout/NavLinks";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/cn";

const pillClass = "hover:translate-y-0";

export function SiteHeader({
  dense = false,
  settle = true,
}: {
  dense?: boolean;
  settle?: boolean;
}) {
  return (
    <header
      className={cn(
        "relative z-50 px-1 pt-1.5",
        settle && "dh-header-bar",
        dense ? "pb-1.5" : "pb-[18px]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="shrink-0" aria-label={site.name}>
          <BrandMark variant="light" priority className="h-5 sm:h-6" />
        </Link>
        <NavLinks />
        <div className="flex shrink-0 items-center gap-2">
          <Button
            href={phoneHref()}
            size="sm"
            className={pillClass}
            aria-label={`Call ${site.phoneDisplay}`}
          >
            <Phone size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Call</span>
          </Button>
          <Button
            href={whatsappHref("Hi Drivers Hub, I would like to book a chauffeur.")}
            size="sm"
            className={pillClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Drivers Hub"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
