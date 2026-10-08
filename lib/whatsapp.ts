import { site } from "@/content/site";

export function phoneHref() {
  return `tel:${site.phoneE164}`;
}

export function whatsappHref(message?: string) {
  const url = new URL(`https://wa.me/${site.whatsappE164}`);
  if (message) {
    url.searchParams.set("text", message);
  }
  return url.toString();
}
