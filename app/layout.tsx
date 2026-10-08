import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { BottomBlur } from "@/components/layout/BottomBlur";
import { MarbleBackground } from "@/components/layout/MarbleBackground";
import { LayoutHeader } from "@/components/layout/LayoutHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Chauffeur Service in Colombo, Sri Lanka | Drivers Hub",
    template: "%s | Drivers Hub",
  },
  description:
    "Drivers Hub is a Colombo chauffeur and designated-driver service. Call or WhatsApp 077 141 0588 for night, day, and airport packages.",
  applicationName: site.name,
  keywords: [
    "chauffeur service Colombo",
    "designated driver Sri Lanka",
    "Drivers Hub",
  ],
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "/",
    siteName: site.name,
    title: "Chauffeur Service in Colombo, Sri Lanka | Drivers Hub",
    description:
      "Colombo chauffeur and designated-driver service. Night, day, and airport packages. Call or WhatsApp 077 141 0588.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chauffeur Service in Colombo, Sri Lanka | Drivers Hub",
    description:
      "Colombo chauffeur and designated-driver service. Call or WhatsApp 077 141 0588.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-LK"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-marble font-sans text-ink">
        <JsonLd data={localBusinessJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <MarbleBackground />
        <BottomBlur />
        <SiteShell>
          <LayoutHeader />
          <main id="main" className="relative flex flex-1 flex-col gap-[14px]">
            {children}
          </main>
          <SiteFooter />
        </SiteShell>
      </body>
    </html>
  );
}
