import { site } from "@/content/site";
import { BodyCopy, InnerPage, PageIntro } from "@/components/marketing/PageIntro";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How Drivers Hub handles contact details sent by phone, WhatsApp, or the website form. No account, wallet, or booking login on this site.",
  path: "/privacy",
});

const copy = [
  "This marketing site does not create user accounts, wallets, or live bookings. You can read packages and services without sending us data.",
  "If you call, WhatsApp, email, or use a form, we receive what you type so we can reply. A booking form sends your name, phone, service, date, and note. A chauffeur application sends your name, phone, area, years of driving, licence, availability, and note. Both forms open WhatsApp. Those messages stay in WhatsApp and are not stored in a website database.",
  "We use the same public NAP everywhere: Drivers Hub, 18/4, 5th Mission Lane, Sri Jayawardenepura Kotte, Sri Lanka, telephone +94 77 141 0588, email info@drivershub.lk.",
  "Analytics, if added later, will be documented here before they run. We do not sell contact lists. Hosting logs on Vercel may include IP addresses for a short period as part of running the site.",
  "To ask us to delete a conversation or note you sent, email info@drivershub.lk or WhatsApp the same number. The chauffeur agreement on /agreement covers vehicle and insurance terms for actual jobs; this page only covers website and enquiry privacy.",
];

export default function PrivacyPage() {
  return (
    <InnerPage>
      <PageIntro
        kicker={site.name}
        title="Privacy policy"
        intro="Short policy for a public marketing site. It is not a booking-app privacy notice."
      />
      <BodyCopy paragraphs={copy} />
    </InnerPage>
  );
}
