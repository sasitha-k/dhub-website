export const siteUrl = "https://drivershub.lk";

export const site = {
  name: "Drivers Hub",
  tagline: "Your Chauffeur Partner",
  url: siteUrl,
  locale: "en-LK",
  phoneDisplay: "+94 77 141 0588",
  phoneLocal: "077 141 0588",
  phoneE164: "+94771410588",
  whatsappE164: "94771410588",
  email: "info@drivershub.lk",
  founded: "October 2020",
  foundingDate: "2020-10",
  hours: {
    night: "24/7 night chauffeur",
    day: "Day packages 06:00–21:00",
  },
  address: {
    street: "18/4, 5th Mission Lane",
    locality: "Sri Jayawardenepura Kotte",
    region: "Western Province",
    country: "Sri Lanka",
    countryCode: "LK",
    line: "18/4, 5th Mission Lane, Sri Jayawardenepura Kotte, Sri Lanka",
  },
  social: {
    facebook: "https://www.facebook.com/drivershubsl",
    instagram: "https://www.instagram.com/drivershubsl",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/app", label: "Get the app" },
] as const;

export const footerLegalLinks = [
  { href: "/agreement", label: "Agreement" },
  { href: "/privacy", label: "Privacy" },
] as const;

export const publicRoutes = [
  "/",
  "/about",
  "/services",
  "/services/day-time",
  "/services/night",
  "/services/outstation",
  "/services/airport",
  "/services/heavy-vehicle",
  "/services/vehicle-delivery",
  "/packages",
  "/packages/night-distance",
  "/packages/night-hourly",
  "/packages/day-time",
  "/packages/airport",
  "/packages/long-trip",
  "/packages/vehicle-delivery",
  "/contact",
  "/careers",
  "/agreement",
  "/privacy",
  "/app",
] as const;

export type PublicRoute = (typeof publicRoutes)[number];
