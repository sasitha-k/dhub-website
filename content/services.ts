export type ServiceIcon = "sun" | "moon" | "map" | "plane" | "bus" | "truck";
export type ServiceWash = "teal" | "navy" | "bronze" | "plum";

export type HubService = {
  slug: string;
  name: string;
  href: `/services/${string}`;
  title: string;
  description: string;
  h1: string;
  summary: string;
  body: string[];
  wash: ServiceWash;
  icon: ServiceIcon;
  image: `/services/${string}.jpg`;
  relatedPackageSlugs: string[];
};

export const services: HubService[] = [
  {
    slug: "day-time",
    name: "Day time chauffeur",
    href: "/services/day-time",
    title: "Day time chauffeur in Colombo",
    description:
      "Day time chauffeur in Colombo from LKR 3,000 for 4 hours, valid 06:00–21:00. Custom time blocks on request. Call 077 141 0588.",
    h1: "Day time chauffeur service in Colombo",
    summary: "Hourly chauffeur cover through the working day, 06:00–21:00.",
    body: [
      "Day time chauffeur is the daytime booking: a Drivers Hub driver takes your car for meetings, school runs, errands, and multi-stop days between 06:00 and 21:00. You stay in your own vehicle. We do not send a taxi.",
      "Published day packages start at LKR 3,000 for 4 hours, then 6 hours LKR 3,500, 8 hours LKR 4,000, 10 hours LKR 4,500, and 12 hours LKR 5,000. After 9:00 PM, or after 12 hours, extra time is LKR 500 per hour. Conditions apply.",
      "If you need a custom time block instead of a set package, ask for time-based cover and we will quote it before dispatch. Lorries, buses, and other heavy vehicles are a separate booking: heavy vehicle chauffeur.",
      "A day booking can hold several stops without a taxi waiting in a car park. If the day runs into a night out, say so early. Overtime after 21:00 follows the extra-hour rate. It is not silently converted into a full-night package.",
      "Chauffeurs are interviewed, trained, and issued a Drivers Hub identity card. Most have three or more years of driving, including luxury cars. Fuel, parking, and tolls stay with you.",
      "Call or WhatsApp 077 141 0588 with the date, start time, and likely finish. Airport-only runs use the airport chauffeur service. Trips that leave Colombo for the day use outstation chauffeur.",
    ],
    wash: "bronze",
    icon: "sun",
    image: "/services/set-day-time.jpg",
    relatedPackageSlugs: ["day-time"],
  },
  {
    slug: "night",
    name: "Night chauffeur",
    href: "/services/night",
    title: "Night chauffeur in Colombo",
    description:
      "Night chauffeur and designated driver in Colombo. Distance from LKR 1,800 for 10 km, or hourly from LKR 2,500. WhatsApp 077 141 0588.",
    h1: "Night chauffeur service in Colombo",
    summary: "Designated night chauffeur by distance or by the hour.",
    body: [
      "Night chauffeur is the drive-home service Drivers Hub started with in October 2020. A chauffeur collects you and drives your car when you should not be behind the wheel. People also search this as a designated driver or drink-drive chauffeur. The job is the same: we drive, you ride in your vehicle.",
      "Two night packages cover it. Distance starts at LKR 1,800 for 10 km, then LKR 100 per extra kilometre. Waiting is LKR 300 per 15 minutes after the first 15 minutes, which are free. Hourly starts at LKR 2,500 for one hour, up to LKR 6,000 for a full night from 6:00 PM to 6:00 AM. Inside hourly rules there are no waiting or distance charges. Conditions apply.",
      "Use distance for a short hop home. Use hourly when the evening has several stops or you want the chauffeur on standby. Hourly packages end at 6:00 AM, and the start and end should sit within 15 km or extra kilometres apply. Pickup outside Colombo is extra.",
      "The chauffeur carries Drivers Hub identification. You are not handing keys to an unverified stranger. Staff will not break traffic law because a passenger asks. Smoking and alcohol stay out of the vehicle on our side of the agreement.",
      "This is not a cab. You stay in the car you already insure. Fuel and tolls remain yours. Night chauffeur cover is offered 24/7.",
      "Call or WhatsApp 077 141 0588 when you know the pickup. If the night ends well outside Colombo, ask about outstation night cover instead of stretching a Colombo hourly booking.",
    ],
    wash: "navy",
    icon: "moon",
    image: "/services/set-night.jpg",
    relatedPackageSlugs: ["night-distance", "night-hourly"],
  },
  {
    slug: "outstation",
    name: "Outstation chauffeur",
    href: "/services/outstation",
    title: "Outstation chauffeur day and night",
    description:
      "Outstation chauffeur outside Colombo, day or night, from LKR 5,000. A Drivers Hub driver takes your car. Call 077 141 0588.",
    h1: "Outstation chauffeur service",
    summary: "Day or night chauffeur cover for trips outside Colombo.",
    body: [
      "Outstation chauffeur is for a day or a night that leaves the Colombo loop. A Drivers Hub chauffeur drives your car. You ride along. This is separate from a Colombo day package and from a one-way airport drop.",
      "Outstation day and outstation night each start from LKR 5,000. Conditions apply. The day figure matches the out-of-Colombo 12-hour day cover. Night outstation is its own booking, not a Colombo night-hourly package with a surprise extra at the end.",
      "Tell us the origin, the destination, and whether you expect to return the same day. Highway tolls, fuel, and parking stay with you. If the trip will run overnight, the agreement still expects meals and safe accommodation, or a pre-agreed allowance, to be settled before we dispatch.",
      "A Colombo-only diary belongs on day time or night chauffeur. A capped 12-hour long run with no meal and stay is the long trip package, from LKR 4,500. Use outstation when the job is specifically outside Colombo for the day or the night.",
      "Call or WhatsApp 077 141 0588 with both ends of the trip. We confirm the rate before the chauffeur is sent.",
    ],
    wash: "teal",
    icon: "map",
    image: "/services/set-outstation.jpg",
    relatedPackageSlugs: ["day-time", "long-trip"],
  },
  {
    slug: "airport",
    name: "Airport chauffeur",
    href: "/services/airport",
    title: "Airport chauffeur to BIA",
    description:
      "Airport chauffeur to Bandaranaike (BIA) in your own car from LKR 3,000 one way. Pickup or drop with Drivers Hub. Call 077 141 0588.",
    h1: "Airport chauffeur and driver to BIA",
    summary: "One-way airport pickup or drop in your own car.",
    body: [
      "Airport chauffeur is a one-way drive in your car to or from Bandaranaike International Airport. The published starting rate is LKR 3,000 one way. Conditions apply. You avoid a taxi’s back seat after a long flight and you keep a familiar boot for luggage.",
      "Tell us flight time, direction, and whether the chauffeur should take the car to the terminal or wait at a car park. Late aircraft happen. A quick WhatsApp when you land is better than hoping the kerb plan still holds.",
      "Parking, fuel, and the airport expressway toll are client costs. If you want the driver to stay for the rest of the day in Colombo, combine the landing with day time chauffeur instead of stretching a one-way drop.",
      "Sending an empty car to someone while you fly is vehicle delivery, not this airport service. Read both if the job is mixed.",
      "Drivers Hub chauffeurs are used to highway runs and larger cars. Call 077 141 0588. Night arrivals are expected; night chauffeur cover is 24/7.",
    ],
    wash: "bronze",
    icon: "plane",
    image: "/services/set-airport.jpg",
    relatedPackageSlugs: ["airport", "day-time", "long-trip"],
  },
  {
    slug: "heavy-vehicle",
    name: "Heavy vehicle chauffeur",
    href: "/services/heavy-vehicle",
    title: "Heavy vehicle chauffeur in Colombo",
    description:
      "Heavy vehicle chauffeur for lorries, buses, and other heavy vehicles. The rate is calculated for the job. Call Drivers Hub on 077 141 0588.",
    h1: "Heavy vehicle chauffeur service",
    summary: "A chauffeur for lorries, buses, and other heavy vehicles.",
    body: [
      "Heavy vehicle chauffeur is for lorries, buses, and other heavy vehicles that need a Drivers Hub driver. You keep the vehicle. We send a chauffeur cleared for that class. This is a day booking, separate from a car chauffeur on the day time packages.",
      "The rate is calculated for the vehicle and the job. Tell us the type, the route, and the hours when you call, and we confirm the figure before dispatch. Conditions apply. We do not publish a flat starting price, because a bus and a light lorry are not the same job.",
      "Daytime heavy-vehicle work follows the same 06:00–21:00 window as day time chauffeur. If the job will run later, or leave Colombo, say so when you book so the quote includes the extra time or the outstation leg.",
      "Fuel, tolls, and parking stay with you. The vehicle must be licensed, insured, and roadworthy for its class. We will not take an unroadworthy heavy vehicle onto the road.",
      "A car for meetings is day time chauffeur. A night drive-home in a car is night chauffeur. Moving an empty car is vehicle delivery. Call or WhatsApp 077 141 0588 with the vehicle type and the plan for the day.",
    ],
    wash: "navy",
    icon: "bus",
    image: "/services/set-heavy-vehicle.jpg",
    relatedPackageSlugs: ["day-time"],
  },
  {
    slug: "vehicle-delivery",
    name: "Vehicle delivery chauffeur",
    href: "/services/vehicle-delivery",
    title: "Vehicle delivery chauffeur Sri Lanka",
    description:
      "Vehicle delivery chauffeur in Sri Lanka. We drive your car to a workshop, relative, or city. Ask Drivers Hub for a quote on 077 141 0588.",
    h1: "Vehicle delivery chauffeur",
    summary: "A chauffeur collects or delivers your car when you are not riding.",
    body: [
      "Vehicle delivery is a chauffeur moving your car when you are not in it: a workshop booking while you stay at work, a car that must reach a family member, or a vehicle moving between Colombo and another district. Night drops use the same service.",
      "Colombo and longer runs are priced from the pickup and the drop. Send both addresses and we quote before dispatch. Fuel, tolls, and parking are yours. The car must be insured and roadworthy.",
      "If you will ride along to the airport, that is airport chauffeur, not delivery. If the chauffeur should wait at a workshop and bring the car back, say whether that is one round trip or two legs.",
      "The driver carries Drivers Hub identification. Cab booking is not a substitute for this service.",
      "WhatsApp 077 141 0588 with pickup, drop, and timing.",
    ],
    wash: "plum",
    icon: "truck",
    image: "/services/set-vehicle-delivery.jpg",
    relatedPackageSlugs: ["vehicle-delivery", "day-time"],
  },
];

export const comingSoonService = {
  name: "Cab",
  summary: "Booking opens in the customer app.",
  badge: "Coming soon",
} as const;

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}
