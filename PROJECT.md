# Drivers Hub Website — Cursor Build Brief

This repo (`dhub-website`) is the Next.js marketing site for [drivershub.lk](https://drivershub.lk/). It is **not** a clone of the booking app. Bookings stay in the customer app / WhatsApp / phone.

**Live reference:** [https://drivershub.lk/](https://drivershub.lk/)
**Visual reference:** Driver Hub customer app (Expo) — marble + liquid glass, not the old WordPress template.

Installed stack: **Next.js 16.3 App Router**, React 19, TypeScript, Tailwind v4. Routes live in `app/` (no `src/` directory). Read `node_modules/next/dist/docs/` before adding Next.js APIs.

---

## 1. Product goal

Rebuild Drivers Hub as a fast, crawlable, brand-consistent public site that:

1. Ranks for chauffeur / designated-driver searches in Sri Lanka (Colombo first).
2. Looks like the **customer app**: light marble, frosted glass, cinematic dark heroes, ink icons.
3. Converts to **Call**, **WhatsApp**, and **Get the app**.
4. Keeps existing WordPress URLs working via 301s.

**Out of scope for v1**

- Login, wallet, live booking, maps, driver tracking
- WordPress / Elementor / PHP
- Cab service (app marks it Coming Soon — show a “Soon” badge only)
- Full Sinhala UI (legal page is bilingual; rest is English first)

---

## 2. What is wrong with the current site

The live site is **WordPress + Elementor**. Most nav items are hash links on one page.

| Issue | Evidence | Fix in Next.js |
|---|---|---|
| Almost no real URLs | Nav is `/#about`, `/#packages`, `/#services`, `/#contact` | Separate routes with unique titles + H1s |
| Indexed page is dead | `/our-packages/` returns **404** and shows a leftover car-wash theme menu | 301 → `/packages` |
| Broken heading outline | Homepage has **13 H1s**, including animated counters that render as `0` | One H1 per page. Stats as `<p>` / `<div>` with real numbers in HTML |
| No meta description | `meta[name=description]` is missing | Per-page 150–160 char descriptions |
| No JSON-LD | Zero `application/ld+json` | LocalBusiness + Service + FAQ + Breadcrumb |
| Sitemap broken | `/sitemap.xml` 500s | `app/sitemap.ts` |
| Template junk | 404 page lists “Car Wash”, “Drive-Through Wash” | Custom 404 |
| Price conflict | Homepage vs old Google cache of `/our-packages/` | One typed content source |
| Weak Core Web Vitals | Elementor + Google Fonts + accelerator plugin | Server components, `next/font`, `next/image` |
| Brand mismatch | Dark WP hero, generic chauffeur stock | App marble + glass + existing banners |

**Keep from the current site**

- Brand: **Drivers Hub** / “Your Chauffeur Partner”
- Phone: `0771410588` / `+94 77 141 0588`
- Email: `info@drivershub.lk`
- Address: 18/4, 5th Mission Lane, Sri Jayawardenepura Kotte, Sri Lanka
- Social: [facebook.com/drivershubsl](https://www.facebook.com/drivershubsl), [instagram.com/drivershubsl](https://www.instagram.com/drivershubsl)
- Founded October 2020, Colombo-based chauffeur / drive-home service
- Bilingual agreement at `/agreement-policies/`
- Service stories (personal driver, workshop, vehicle delivery, airport, stress-free, multi-stop)

---

## 3. Confirm before coding prices

Homepage and the old packages listing disagree. **Do not invent prices.** Until the owner confirms, publish the **live homepage** rates and add “Starting from · conditions apply”.

### Use these as the v1 draft (homepage, live)

**Night — distance**

- 10 km — LKR 1,800
- Extra km — LKR 100
- Waiting 15 min — LKR 300
- First 15 minutes free
- Extra charge outside Colombo

**Night — hourly**

- 1h 2,500 · 2h 3,100 · 3h 3,800 · 4h 4,500 · 6h 5,000
- Full night 12h (6:00 PM–6:00 AM) — LKR 6,000
- No waiting / distance charges inside rules
- Start–end within 15 km or extra km applies
- All hourly packages end at 6:00 AM
- Colombo pickup; outside Colombo extra

**Day time**

- 4h 3,000 · 6h 3,500 · 8h 4,000 · 10h 4,500 · 12h 5,000
- Valid 06:00–21:00
- LKR 500 / extra hour after 9:00 PM or after 12 hours
- Out-of-Colombo day packages from LKR 5,000 / 12h

**Other**

- Airport pickup/drop (one way) — LKR 3,000
- Long trip / day (no meal & stay, max 12h) — LKR 4,500

**Owner must confirm** (old listing, now 404): 5 km night pack LKR 1,500; waiting LKR 350; day 4h LKR 2,500; airport LKR 2,500; vehicle delivery tiers (Colombo 1–15 / Colombo / Western / island-wide).

When the customer API is public, switch package cards to ISR. Until then, keep prices in `content/packages.ts`.

---

## 4. Stack

Already created. Do not run `create-next-app` again.

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router, TypeScript | SSR/SSG, Metadata API, sitemap |
| Styling | Tailwind v4 | Closest to the app’s utility + token model |
| Fonts | `next/font` — Geist (already in `app/layout.tsx`) | No render-blocking Google CSS |
| Icons | `lucide-react` | Same family as the app |
| Content | Typed TS modules in `content/` | SEO-stable, no CMS delay |
| Forms | Server Action → email or Formspree / Resend | No client-only form that search can’t see around |
| Analytics | Plausible or GA4 after launch | Don’t block LCP |
| Hosting | Vercel | Edge, redirects, OG, ISR |
| Images | `next/image` + WebP/AVIF | Hero LCP |

**Do not add** WordPress, a page builder, Framer Motion on every section, or a booking backend.

---

## 5. Match the customer app (theme)

The **live app UI** is the light liquid-glass system, not the older black glass screen.

### Tokens — copy into `app/tokens.css` (or `styles/tokens.css`) + Tailwind theme

```ts
export const theme = {
  color: {
    bg: "#FAFAFA",
    surface: "#ECEDEF",
    card: "#FFFFFF",
    ink: "#16181D",
    inkSecondary: "#5C616B",
    inkMuted: "#9097A1",
    brand: "#01333C",          // logo / primary CTA
    brandSoft: "#001A1F",
    heroFallback: "#15171C",
    glassFill: "rgba(22, 30, 42, 0.16)",
    headerGlass: "rgba(255, 255, 255, 0.72)",
    border: "rgba(17, 19, 24, 0.08)",
    badge: "#23262D",
    price: "#E53935",          // money only, same as app balance
    washTeal: "rgba(19, 78, 74, 0.14)",
    washNavy: "rgba(30, 58, 138, 0.14)",
    washBronze: "rgba(120, 53, 15, 0.14)",
    washPlum: "rgba(88, 28, 135, 0.14)",
    inkTeal: "#134E4A",
    inkNavy: "#1E3A8A",
    inkBronze: "#78350F",
    inkPlum: "#581C87",
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    hero: 26,
    pill: 999,
  },
};
```

### Visual rules

- Full-page **marble / stone texture** at low opacity on `#FAFAFA` (reuse `glass-background.png` from the customer app, optimized).
- Cards: frosted white, `backdrop-blur-xl`, soft shadow, 18–26px radius. One blur layer. No nested blur stacks.
- Heroes: full-bleed photo, dark gradient overlay, **white title**, glass CTA (dark frosted pill). Reuse `chauffeur-banner.png` / `hero-banner.png` / `cab-banner.png`.
- Service tiles: muted `#ECEDEF` surface, circular icon wash, dark `SOON` / `ELITE` pills.
- Package cards: icon chip + name + “Starting from LKR …” + Details link — same information hierarchy as `LiquidPackageCard`.
- Header: frosted glass, logo left, links center/right, **Call** + **WhatsApp** always visible.
- Footer: address, hours, packages, legal, social.
- Motion: short fade/slide on first paint only. Respect `prefers-reduced-motion`.
- Do **not** port NativeWind, expo-blur, Skia, or Reanimated.

### Tone

Premium, calm, Colombo, safety-first. Avoid “drunk” jokes in titles. Use **designated driver** / **drink-drive chauffeur** in body and metadata (people search both).

---

## 6. Information architecture

```
/                         Home
/about                    Who we are + hiring drivers
/services                 Service index
/services/chauffeur       Flagship (maps to app Chauffeur)
/services/designated-driver
/services/airport
/services/vehicle-delivery
/services/personal-driver
/packages                 All packages + filters Day / Night
/packages/night-distance
/packages/night-hourly
/packages/day-time
/packages/airport
/packages/long-trip
/packages/vehicle-delivery
/contact                  Form + map + WhatsApp
/agreement                EN + SI (from current legal page)
/privacy                  New — required for forms/analytics
/app                      Get the customer app (store / TestFlight / APK later)
```

### Redirects (`next.config.ts`)

| From | To | Type |
|---|---|---|
| `/our-packages/` | `/packages` | 301 |
| `/our-packages` | `/packages` | 301 |
| `/agreement-policies/` | `/agreement` | 301 |
| `/agreement-policies` | `/agreement` | 301 |
| `/#about` | cannot 301 a hash | Add `/about` and keep homepage `#about` for old links |
| `/#packages` | same | Homepage still has a packages teaser with `id="packages"` |
| `/#services` | same | `id="services"` |
| `/#contact` | same | `id="contact"` |

WordPress leftover query URLs and `/page/2/` → 404, not indexed.

### Homepage sections (order)

1. Hero — “Professional chauffeurs in Colombo” + Call / WhatsApp / View packages
2. Trust strip — founded 2020, Colombo-based, vetted drivers, 24/7 night service (real text, not `0` counters)
3. Services grid (6 tiles → service pages)
4. Popular packages (4 cards: Night distance, Night hourly, Day, Airport)
5. How it works — Call or book in app → driver arrives → you ride in your car
6. Why Drivers Hub — ID’d chauffeurs, 3+ years, luxury-car experience
7. Testimonials (keep the three current quotes unless owner replaces them)
8. App download
9. FAQ (SEO)
10. Contact CTA

---

## 7. SEO (do this from day one, not after UI)

### Technical

- `app/layout.tsx`: `metadataBase: new URL("https://drivershub.lk")`, default title template `%s | Drivers Hub`
- Every page: unique `title` (50–60 chars), `description`, `alternates.canonical`, Open Graph, Twitter card
- `app/robots.ts` — allow `/`, sitemap URL, disallow `/api/`
- `app/sitemap.ts` — only public canonical URLs
- `app/icon.tsx` / `apple-icon` / `opengraph-image.tsx` per key routes or a default OG
- Semantic HTML: one H1, H2 sections, `<header>` `<main>` `<footer>`, `<address>`
- All primary content in **Server Components**. Client components only for menu, form UX, WhatsApp widget
- Images: width/height, `priority` on LCP hero only, descriptive `alt`
- Internal links: every service/package page links to siblings + contact
- 404 + 301s as above
- `lang="en-LK"` on `<html>`
- No `noindex` on money pages
- JSON-LD via `<script type="application/ld+json">` with `JSON.stringify` (not `innerHTML` concat)

### Schema

1. **Organization + LocalBusiness** on every page (graph)
2. **Service** on each service/package page (areaServed: Colombo, Western Province, Sri Lanka)
3. **Offer / PriceSpecification** on package pages (LKR)
4. **FAQPage** on home + packages
5. **BreadcrumbList** on nested routes
6. **WebSite** with `SearchAction` only if you add site search (skip in v1)

### Keyword map (one primary intent per URL)

| URL | Primary query |
|---|---|
| `/` | chauffeur service Colombo / Drivers Hub Sri Lanka |
| `/services/designated-driver` | drink and drive driver Colombo / designated driver Sri Lanka |
| `/services/airport` | airport chauffeur / driver to BIA |
| `/services/vehicle-delivery` | vehicle delivery driver Sri Lanka |
| `/services/personal-driver` | on demand personal driver Colombo |
| `/packages/night-hourly` | night chauffeur hourly package |
| `/packages/night-distance` | drink drive 10km package |
| `/packages/day-time` | daytime chauffeur hourly Colombo |
| `/about` | Drivers Hub about / chauffeur company Sri Lanka |
| `/contact` | Drivers Hub contact / 0771410588 |
| `/agreement` | Drivers Hub agreement / chauffeur terms |

Write **unique 400–800 words** on money pages. Do not paste the homepage onto every route.

### Local SEO

- NAP identical everywhere: phone, email, address spelling
- Embed Google Map on `/contact` (iframe or official embed, lazy)
- `geo` / LocalBusiness `address`, `telephone`, `openingHoursSpecification` (24/7 for night service; say so honestly)
- Later: Google Business Profile (not in the repo)

### Content rules

- Put real prices in HTML. No JS-only price injection.
- Counters: if you animate, the **final number must be in the DOM** before JS. Better: skip fake “0 → N” counters until you have real stats.
- Testimonials: mark up with `review` schema only if they are real. If stock, label as illustrative or replace.

---

## 8. File tree (this repo)

`create-next-app` put routes in `app/` at the repo root. Keep it that way.

```
app/
  layout.tsx
  page.tsx
  globals.css
  robots.ts
  sitemap.ts
  opengraph-image.tsx
  not-found.tsx
  about/page.tsx
  services/page.tsx
  services/[slug]/page.tsx
  packages/page.tsx
  packages/[slug]/page.tsx
  contact/page.tsx
  agreement/page.tsx
  privacy/page.tsx
  app/page.tsx
components/
  layout/SiteHeader.tsx
  layout/SiteFooter.tsx
  layout/MarbleBackground.tsx
  ui/GlassCard.tsx
  ui/Button.tsx
  ui/Badge.tsx
  ui/SectionHeading.tsx
  marketing/Hero.tsx
  marketing/ServiceTile.tsx
  marketing/PackageCard.tsx
  marketing/Faq.tsx
  marketing/WhatsAppButton.tsx
  seo/JsonLd.tsx
content/
  site.ts              // NAP, social, CTAs
  services.ts
  packages.ts
  faqs.ts
  testimonials.ts
  agreement.ts         // EN + SI sections
lib/
  seo.ts               // buildMetadata()
  whatsapp.ts          // wa.me/94771410588
  format.ts            // LKR
```

`generateStaticParams` for `[slug]` from content modules.

---

## 9. Components to port (web versions, not RN)

| App | Web |
|---|---|
| `MarbleBackground` | fixed CSS background-image + light frost |
| `HeroCard` | homepage hero + optional second “Cab soon” slide (static, no autoplay for SEO) |
| `ServiceTile` + `GlassTileShell` | service grid |
| `LiquidPackageCard` | package list/detail cards |
| `HomeHeader` glass pill | desktop/mobile nav glass |
| Chauffeur / cab banners | `next/image` heroes |

Copy assets from the customer app `assets/images/` and compress.

---

## 10. Conversion

Primary: `tel:+94771410588`
Secondary: `https://wa.me/94771410588` with a prefilled message
Tertiary: `/app` when store links exist
Contact form: name, phone, service type, date, note → email to `info@drivershub.lk`

Sticky mobile bar: Call | WhatsApp. Do not cover content; add bottom padding.

---

## 11. Build order (Cursor sessions)

Do these as **separate chats** so the agent does not dump the whole site in one pass.

1. **Scaffold + tokens + layout** — header, footer, marble bg, buttons, 404
2. **SEO chrome** — `metadataBase`, robots, sitemap, JsonLd helper, `buildMetadata()`
3. **Content modules** — site, packages, services, FAQs, agreement (no UI polish yet)
4. **Home** — sections listed above, unique metadata
5. **Packages index + two dynamic package pages**
6. **Services index + service pages**
7. **About, contact, agreement, privacy, app**
8. **Redirects + OG images + Lighthouse pass**
9. **Copy review + owner price confirmation**
10. **Deploy to Vercel**, point `drivershub.lk` when ready, submit sitemap in Search Console

Definition of done for each page:

- Unique title, description, canonical, H1
- Server-rendered main copy
- Internal links
- JSON-LD valid
- Mobile layout matches app density (comfortable, not cramped WP)
- CTA works

---

## 12. First Cursor prompt

```
Read PROJECT.md and AGENTS.md before writing any code.

Build the Drivers Hub marketing site (Next.js App Router + TypeScript + Tailwind).

This is NOT a booking app. No auth, no maps booking flow, no WordPress.

Match the customer-app visual system in PROJECT.md: marble #FAFAFA background, frosted glass cards, dark cinematic heroes, ink icon tiles, brand teal #01333C, money red only for prices.

SEO is a first-class requirement:
- Server Components for all page copy
- metadataBase https://drivershub.lk
- unique metadata + one H1 per page
- sitemap.ts + robots.ts
- JSON-LD LocalBusiness on the layout
- prices in HTML from content/packages.ts
- no animated counters that start at 0

Start with session 1 only:
1. Design tokens and Tailwind theme
2. Marble background, SiteHeader, SiteFooter, Button, GlassCard
3. Homepage shell with real metadata (you can use placeholder section bodies)
4. Custom not-found
5. robots.ts + sitemap.ts for the planned routes

Do not invent extra pages or a blog. Do not add a CMS.
After that, stop and wait.
```

---

## 13. Launch checklist

- [ ] Owner confirmed package prices
- [ ] Logo SVG (current site logo is PNG on WordPress uploads — export clean SVG)
- [ ] App store / Play / APK links or hide `/app` store buttons
- [ ] Privacy policy reviewed
- [ ] Agreement text copied exactly (EN + SI)
- [ ] 301s live on the production domain
- [ ] Google Search Console + sitemap submit
- [ ] Lighthouse: 90+ Performance / SEO / a11y on Home + a package page
- [ ] WhatsApp and `tel:` tested on iOS and Android
- [ ] Remove WordPress, Elementor, and the Seraphinite banner after cutover
