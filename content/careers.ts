import { site } from "@/content/site";

export const chauffeurRole = {
  href: "/careers",
  title: "Chauffeur",
  datePosted: "2026-09-24",
  validThrough: "2027-09-24",
  location: "Colombo and Sri Jayawardenepura Kotte",
  summary:
    "Drive clients’ cars for Drivers Hub. Night designated-driver cover, daytime hours, airport runs, and vehicle delivery. Hired after an interview.",
  schemaDescription:
    "Drivers Hub is hiring chauffeurs in Colombo and Sri Jayawardenepura Kotte. You drive the client’s car for night designated-driver work, daytime hours, airport pickup and drop, and vehicle delivery. Applicants are interviewed. Successful chauffeurs carry a Drivers Hub identity card. Shifts cover night service and day packages from 06:00 to 21:00. Pay is discussed at the interview. Apply on the careers page by WhatsApp.",
  paragraphs: [
    "Drivers Hub hires chauffeurs to drive the client’s own car. You collect the client, drive their vehicle, and hand it back. Night work is how the company started in October 2020: a designated driver for people who should not drive themselves home. Daytime hours, airport runs, personal-driver days, and vehicle delivery use the same bench.",
    "Every chauffeur is recruited after an interview. Honesty and attitude are what we look for first. Staff are trained, expected to be disciplined, and expected to present well. Once you are on the roster you carry a Drivers Hub identity card. Most drivers already have at least three years behind the wheel, including luxury and exotic makes such as BMW 3, 5 and 7 Series, Mercedes-Benz C, E and S Classes, Audi A Series, and Range Rover.",
    "Night chauffeur cover runs around the clock. Day packages run 06:00–21:00. Jobs are based in Colombo, with the office at 18/4, 5th Mission Lane, Sri Jayawardenepura Kotte. Out-of-Colombo trips happen; say on the application if you can take them. Fuel, highway tolls, and parking stay with the client, as on the agreement. For overnight or outstation work the client provides meals and safe accommodation, or a pre-agreed allowance.",
    "On the road you follow traffic law. Smoking and alcohol stay out of the vehicle, including on designated-driver nights, and you stay sober. Pay is discussed at the interview, along with which shifts you can cover.",
  ],
  youWill: [
    "Drive the client’s car for night designated-driver and night hourly bookings.",
    "Cover daytime hours, airport pickup and drop, and vehicle delivery, including workshop runs.",
    "Carry a Drivers Hub identity card and present yourself as staff of the company.",
    "Keep to traffic law. Do not smoke or drink in the vehicle.",
  ],
  weLookFor: [
    "A valid licence for the vehicles you will drive, usually a light vehicle licence.",
    "Driving experience you can talk through in an interview. Three or more years is typical on the current roster.",
    "Comfort with client cars, including luxury makes if you have that experience.",
    "Availability for night shifts, day shifts, or both, based in or near Colombo.",
    "A clear phone number. We reply on WhatsApp or by call.",
  ],
} as const;

export const licenceOptions = [
  "Light vehicle",
  "Heavy vehicle",
  "Light and heavy",
] as const;

export const availabilityOptions = [
  "Night shifts",
  "Day shifts",
  "Night and day",
] as const;

export const applyIntro = `The form opens WhatsApp to ${site.phoneDisplay}. We do not store applications on this website.`;

export type ChauffeurRole = typeof chauffeurRole;
