import Link from "next/link";
import { site } from "@/content/site";
import { BodyCopy, InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { CtaRow } from "@/components/marketing/CtaRow";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About our Colombo chauffeur company",
  description:
    "Drivers Hub is a Colombo chauffeur company founded in October 2020. ID’d drivers, designated-driver roots, and luxury-car experience.",
  path: "/about",
});

const aboutCopy = [
  "Drivers Hub started operations in October 2020 from Sri Jayawardenepura Kotte. The idea came from a gap we knew too well: people needed an efficient, trustworthy drive-home, and too many drink-driving accidents and arrests followed when that help was not there. The first customer base was people who drink, from all walks of life. We still take that designated-driver work seriously.",
  "After a three-month trial, the company grew into a chauffeur service as well as a drive-home. Honesty and attitude are two things we look for in a chauffeur. Staff, from managers to drivers, are trained, disciplined, and expected to present well. Every chauffeur carries a Drivers Hub identity card and is recruited after an interview.",
  "Most of our drivers have at least three years of experience, including luxury and exotic makes such as BMW 3, 5 and 7 Series, Mercedes-Benz C, E and S Classes, Audi A Series, and Range Rover. Your car stays yours. We drive it. We are not a cab company; cab booking in the app is marked coming soon.",
  "Customer service, convenience, safety, and trust are the point of the business. We assign each employee a share of that reputation. Whether you need a night chauffeur, a daytime driver, airport cover, or vehicle delivery, the same office answers: 18/4, 5th Mission Lane, Sri Jayawardenepura Kotte.",
  "We hire chauffeurs after an interview. Open roles and the application form are on the careers page. Service bookings still use 077 141 0588.",
];

export default function AboutPage() {
  return (
    <InnerPage>
      <PageIntro
        kicker={site.name}
        title="A Colombo chauffeur company since 2020"
        intro="We send ID’d chauffeurs to drive your car. Night designated-driver work is how we started. Day, airport, and delivery work followed."
      />
      <BodyCopy paragraphs={aboutCopy} />
      <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-secondary">
        <Link className="underline" href="/careers">
          Apply as a chauffeur
        </Link>
        .
      </p>
      <div className="mt-10">
        <CtaRow message="Hi Drivers Hub, I would like to talk about chauffeur work or a booking." />
      </div>
      <p className="mt-8 text-sm text-ink-secondary">
        Read the{" "}
        <Link className="underline" href="/agreement">
          agreement
        </Link>{" "}
        and{" "}
        <Link className="underline" href="/packages">
          packages
        </Link>{" "}
        before a first night booking.
      </p>
    </InnerPage>
  );
}
