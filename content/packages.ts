export type PackagePeriod = "night" | "day" | "other";

export type PackageRate = {
  label: string;
  priceLkr: number;
  note?: string;
};

export type ServicePackage = {
  slug: string;
  name: string;
  href: `/packages/${string}`;
  period: PackagePeriod;
  teaser: boolean;
  rateChip: string;
  startingFromLkr: number | null;
  title: string;
  description: string;
  h1: string;
  summary: string;
  body: string[];
  rates: PackageRate[];
  conditions: string[];
  relatedServiceSlugs: string[];
};

export const packages: ServicePackage[] = [
  {
    slug: "night-distance",
    name: "Night — distance",
    href: "/packages/night-distance",
    period: "night",
    teaser: true,
    rateChip: "10 km",
    startingFromLkr: 1800,
    title: "Drink-drive 10 km night package",
    description:
      "Colombo designated-driver night package from LKR 1,800 for 10 km. Extra km, waiting, and out-of-Colombo rules. Call 077 141 0588.",
    h1: "Night distance chauffeur package in Colombo",
    summary: "Pay by distance for a designated night chauffeur in Colombo.",
    body: [
      "The night distance package is for people who need a designated driver in Colombo after dark and want to pay for the kilometres actually covered. A Drivers Hub chauffeur arrives at your pickup, drives your car, and takes you home. You stay in your own vehicle. We do not send a taxi.",
      "The live rate for the first 10 km is LKR 1,800. Extra distance is LKR 100 per kilometre. Waiting is LKR 300 per 15 minutes after the first 15 minutes, which are free. Pickup outside Colombo carries an extra charge. These are the homepage rates published as a starting point; conditions apply.",
      "This is the package people search when they want a drink-drive or designated-driver cover for a short night out rather than a full hourly block. If your evening is a restaurant, a friend’s house, and a direct run home inside Colombo, distance pricing is usually clearer than booking several hours.",
      "The chauffeur is ID’d by Drivers Hub. You are not handing your keys to an unverified stranger. Drivers are screened, and most have at least three years of experience, including luxury cars. The job is to get you and the vehicle home without drama — traffic law included. We will not be asked to speed, skip lights, or ignore insurance rules.",
      "Fuel, parking, and highway tolls stay with you, as set out in the agreement. The car must be roadworthy, licensed, and insured. If you are heading far out of Colombo, ask us to quote before you leave so the extra-area charge is not a surprise at drop-off.",
      "Call or WhatsApp 077 141 0588 when you know the pickup. Night chauffeur cover runs around the clock. If your plan might stretch past a short hop, compare this page with the night hourly package. A 12-hour full night from 6:00 PM to 6:00 AM can be cheaper than stacking distance and waiting.",
    ],
    rates: [
      { label: "10 km", priceLkr: 1800 },
      { label: "Extra km", priceLkr: 100 },
      { label: "Waiting 15 min", priceLkr: 300, note: "First 15 minutes free" },
    ],
    conditions: [
      "Starting from · conditions apply",
      "First 15 minutes of waiting are free",
      "Extra charge outside Colombo",
    ],
    relatedServiceSlugs: ["night"],
  },
  {
    slug: "night-hourly",
    name: "Night — hourly",
    href: "/packages/night-hourly",
    period: "night",
    teaser: true,
    rateChip: "From 1h",
    startingFromLkr: 2500,
    title: "Night chauffeur hourly packages",
    description:
      "Hourly night chauffeur in Colombo from LKR 2,500. Full night 12h is LKR 6,000. No waiting or distance charges inside the rules.",
    h1: "Night hourly chauffeur packages in Colombo",
    summary: "Hourly night chauffeur cover, including a full-night 12-hour option.",
    body: [
      "Night hourly packages are for evenings that do not fit a single 10 km hop. You book a chauffeur for a block of time. Inside the published rules there are no waiting charges and no distance charges. The chauffeur stays with your car until the package ends.",
      "Live homepage rates start at LKR 2,500 for one hour, then 2 hours LKR 3,100, 3 hours LKR 3,800, 4 hours LKR 4,500, and 6 hours LKR 5,000. The full-night 12-hour cover from 6:00 PM to 6:00 AM is LKR 6,000. All hourly packages end at 6:00 AM. Colombo pickup is the default; outside Colombo is extra.",
      "The start and end points should sit within 15 km of each other. Extra kilometres apply if you finish farther away. That rule stops a “Colombo hourly” booking from becoming an unpaid island run. If you already know the night will end out of town, tell us when you call.",
      "This is the usual choice for a long dinner, several stops, or a function where you do not want the meter running on waiting. It is also the package for people who want a designated driver on standby rather than a one-way drop.",
      "Drivers Hub has supplied chauffeurs in Colombo since October 2020. Honesty and attitude are part of hiring. Staff carry a Drivers Hub identity card. You ride in your car; we do not substitute a cab. Cab hire, if it arrives later in the app, is marked coming soon and is not this service.",
      "Compare hourly with the night distance pack if your route is short and direct. Compare with daytime hours if you need a chauffeur before evening. Call or WhatsApp 077 141 0588. Night service is offered 24/7; the hourly clock still ends at 6:00 AM unless you book the next cover.",
    ],
    rates: [
      { label: "1 hour", priceLkr: 2500 },
      { label: "2 hours", priceLkr: 3100 },
      { label: "3 hours", priceLkr: 3800 },
      { label: "4 hours", priceLkr: 4500 },
      { label: "6 hours", priceLkr: 5000 },
      { label: "Full night 12h (6:00 PM–6:00 AM)", priceLkr: 6000 },
    ],
    conditions: [
      "Starting from · conditions apply",
      "No waiting or distance charges inside the package rules",
      "Start and end within 15 km, or extra km applies",
      "All hourly packages end at 6:00 AM",
      "Colombo pickup; outside Colombo extra",
    ],
    relatedServiceSlugs: ["night", "outstation"],
  },
  {
    slug: "day-time",
    name: "Day time",
    href: "/packages/day-time",
    period: "day",
    teaser: true,
    rateChip: "From 4h",
    startingFromLkr: 3000,
    title: "Daytime chauffeur hours in Colombo",
    description:
      "Daytime chauffeur packages in Colombo from LKR 3,000 for 4 hours, valid 06:00–21:00. Extra hour after 9:00 PM is LKR 500.",
    h1: "Daytime chauffeur packages in Colombo",
    summary: "Daytime chauffeur hours in Colombo, valid 06:00–21:00.",
    body: [
      "Daytime packages cover workdays, school runs, meetings, and errands where you want a chauffeur in your own car between 06:00 and 21:00. This is not a night designated-driver pack. It is hourly cover while shops, offices, and clinics are open.",
      "Live rates are LKR 3,000 for 4 hours, LKR 3,500 for 6 hours, LKR 4,000 for 8 hours, LKR 4,500 for 10 hours, and LKR 5,000 for 12 hours. After 9:00 PM, or after 12 hours, extra time is LKR 500 per hour. Pickup outside Colombo is extra. Out-of-Colombo day packages start from LKR 5,000 for 12 hours.",
      "A chauffeur on a day booking can handle multi-stop diaries: bank, workshop drop, a meeting in Colombo 7, then home. You are not paying a taxi waiting in a car park. You keep the same driver and the same vehicle.",
      "If the day turns into a night out, say so early. Crossing into night rules is cleaner when we know. A day pack that overruns after 21:00 is billed on the extra-hour rate above, not silently converted into a full-night 12-hour package.",
      "Drivers are interviewed, trained, and issued a Drivers Hub ID. Most have three or more years of driving, including BMW, Mercedes-Benz, Audi, and Range Rover. We take the agreement on vehicle condition, insurance, fuel, and tolls seriously. Those costs stay with the client.",
      "Book by calling or WhatsApping 077 141 0588 with the date, start time, and likely finish. If you only need an airport run, use the airport package instead. If you need the same chauffeur pattern across several days, say so when you call and we will match the hours.",
    ],
    rates: [
      { label: "4 hours", priceLkr: 3000 },
      { label: "6 hours", priceLkr: 3500 },
      { label: "8 hours", priceLkr: 4000 },
      { label: "10 hours", priceLkr: 4500 },
      { label: "12 hours", priceLkr: 5000 },
      { label: "Out-of-Colombo day / 12h", priceLkr: 5000 },
    ],
    conditions: [
      "Starting from · conditions apply",
      "Valid 06:00–21:00",
      "LKR 500 per extra hour after 9:00 PM or after 12 hours",
      "Out-of-Colombo day packages from LKR 5,000 / 12h",
    ],
    relatedServiceSlugs: ["day-time", "airport", "outstation"],
  },
  {
    slug: "airport",
    name: "Airport",
    href: "/packages/airport",
    period: "other",
    teaser: true,
    rateChip: "One way",
    startingFromLkr: 3000,
    title: "Airport chauffeur pickup and drop",
    description:
      "One-way airport chauffeur pickup or drop in your car from LKR 3,000. Bandaranaike (BIA) runs with Drivers Hub. Call 077 141 0588.",
    h1: "Airport chauffeur pickup and drop",
    summary: "One-way airport pickup or drop with a Drivers Hub chauffeur.",
    body: [
      "Airport packages are one-way chauffeur runs in your own car, to or from the airport. The live homepage rate is LKR 3,000 one way. Conditions apply. You are not booking a cab fleet car. A Drivers Hub chauffeur meets you or your vehicle and drives the route.",
      "For Bandaranaike International Airport (BIA) that usually means a Colombo pickup heading north, or a landing followed by a drive home in the car you already keep in the city. Tell us the flight number, terminal side if you know it, and whether the chauffeur should wait airside-adjacent or at a car park.",
      "Waiting and parking at the airport follow the same client-pays rule as the rest of our work: fuel, tolls, and parking are yours. If the flight is late, message us. We would rather hold with a clear waiting expectation than leave you on the kerb.",
      "Travellers use this when a taxi feels expensive or uncomfortable after a long haul, and when luggage is easier in a familiar boot. Families use it to send a parent or guest without putting a tired driver on the airport expressway.",
      "If you need the chauffeur to stay all day after landing, look at daytime hours instead of a one-way drop. If you are sending the empty car to a relative while you fly, that is vehicle delivery, not this airport rate.",
      "Call or WhatsApp 077 141 0588 with the date and direction. Night landings are fine; night chauffeur cover is 24/7. Read the agreement so insurance and vehicle documents are in order before we start.",
    ],
    rates: [{ label: "Airport pickup/drop (one way)", priceLkr: 3000 }],
    conditions: ["Starting from · conditions apply"],
    relatedServiceSlugs: ["airport", "day-time"],
  },
  {
    slug: "long-trip",
    name: "Long trip",
    href: "/packages/long-trip",
    period: "other",
    teaser: false,
    rateChip: "Max 12h",
    startingFromLkr: 4500,
    title: "Long-trip chauffeur per day",
    description:
      "Long-trip chauffeur cover from LKR 4,500 per day, no meal and stay, maximum 12 hours. Call Drivers Hub on 077 141 0588.",
    h1: "Long-trip chauffeur package",
    summary: "Long trip / day cover, no meal and stay, maximum 12 hours.",
    body: [
      "The long-trip package is a day rate for runs that leave the usual Colombo loop. The live homepage figure is LKR 4,500 per day, without meal and accommodation, for a maximum of 12 hours. Conditions apply. It is not the out-of-Colombo 12-hour day pack that starts at LKR 5,000, and it is not a full overnight with stay.",
      "Use this when you need a chauffeur for an outstation day and will handle the driver’s meals yourself only if you later agree that in writing. As published, this rate excludes meal and stay. The bilingual agreement still says that for overnight or outstation work you must provide meals and safe accommodation or a pre-agreed allowance. If the trip will run overnight, say so before we dispatch.",
      "Highway tolls, fuel, and parking remain the client’s cost. The vehicle must be roadworthy and insured. Mechanical failure, tyre bursts, and third-party fault sit outside our liability, as the agreement states.",
      "If the itinerary is several Colombo stops inside 06:00–21:00, a daytime hourly pack is usually the better fit. If the trip is only to BIA, use the airport one-way rate. Long trip is for the in-between: a 12-hour ceiling, a published day figure, and a chauffeur who already knows luxury cars and highway work.",
      "Call or WhatsApp 077 141 0588 with origin, destination, and whether you expect to return the same day. We will confirm whether this rate, a day pack, or a custom quote applies. We do not invent island-wide delivery tiers on this page.",
    ],
    rates: [{ label: "Long trip / day (max 12h)", priceLkr: 4500 }],
    conditions: [
      "Starting from · conditions apply",
      "No meal and stay",
      "Maximum 12 hours",
    ],
    relatedServiceSlugs: ["outstation", "day-time"],
  },
  {
    slug: "vehicle-delivery",
    name: "Vehicle delivery",
    href: "/packages/vehicle-delivery",
    period: "other",
    teaser: false,
    rateChip: "Quote",
    startingFromLkr: null,
    title: "Vehicle delivery chauffeur rates",
    description:
      "Have a Drivers Hub chauffeur deliver your car in Colombo, the Western Province, or island-wide. Ask for a confirmed quote on 077 141 0588.",
    h1: "Vehicle delivery chauffeur",
    summary:
      "A chauffeur delivers your vehicle. Ask us for the current Colombo, Western, and island-wide rate.",
    body: [
      "Vehicle delivery is a chauffeur moving your car from one place to another when you are not riding along — or when a family member needs the car and you cannot make the drive. Typical jobs: sending a car to a workshop, delivering a vehicle to a relative, or collecting a car from a park-and-fly lot.",
      "Older public listings showed tiered delivery prices for Colombo 1–15, greater Colombo, Western Province, and island-wide. Those figures are not confirmed for this site, so we do not publish a starting price here. WhatsApp or call 077 141 0588 with both addresses and we will quote before dispatch.",
      "The chauffeur carries Drivers Hub identification. Fuel, tolls, and parking are yours. The car must be licensed, insured, and safe to drive. We will not take a vehicle that is obviously unroadworthy onto the expressway.",
      "If you are in the car for an airport run, that is the airport package, not delivery. If you want the chauffeur to wait at a workshop and bring the car back, say whether that is a round trip or two one-way deliveries.",
      "Delivery is still a chauffeur service, not a cab. Cab booking in the customer app is marked coming soon and is not a substitute for this page.",
    ],
    rates: [],
    conditions: ["Contact Drivers Hub for a confirmed quote"],
    relatedServiceSlugs: ["vehicle-delivery"],
  },
];

export const homeTeaserPackages = packages.filter((item) => item.teaser);

export function getPackage(slug: string) {
  return packages.find((item) => item.slug === slug);
}

export function packagesByPeriod(period: PackagePeriod | "all") {
  if (period === "all") return packages;
  return packages.filter((item) => item.period === period);
}
