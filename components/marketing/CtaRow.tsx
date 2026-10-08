import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site } from "@/content/site";
import { phoneHref, whatsappHref } from "@/lib/whatsapp";

export function CtaRow({ message }: { message?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button href={phoneHref()}>
        <Phone size={16} aria-hidden="true" />
        Call {site.phoneLocal}
      </Button>
      <Button
        href={whatsappHref(message)}
        variant="outline"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon />
        WhatsApp
      </Button>
    </div>
  );
}
