export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: FaqItem[] = [
  {
    question: "Is Drivers Hub a taxi service?",
    answer:
      "No. A chauffeur drives your own car. Cab booking in the customer app is marked coming soon and is not offered on this site.",
  },
  {
    question: "Do you offer a designated driver or drink-drive chauffeur in Colombo?",
    answer:
      "Yes. Night distance and night hourly packages are the usual designated-driver cover. Call or WhatsApp 077 141 0588.",
  },
  {
    question: "What are the starting prices?",
    answer:
      "Live homepage rates start at LKR 1,800 for a 10 km night distance pack, LKR 2,500 for one night hour, and LKR 3,000 for four daytime hours. Conditions apply.",
  },
  {
    question: "Are you available at night?",
    answer:
      "Night chauffeur cover is offered 24/7. Daytime packages are valid 06:00–21:00.",
  },
  {
    question: "Where are you based?",
    answer:
      "18/4, 5th Mission Lane, Sri Jayawardenepura Kotte, Sri Lanka. Phone 077 141 0588. Email info@drivershub.lk.",
  },
];

export const packageFaqs: FaqItem[] = [
  {
    question: "Which package should I book for a short night out?",
    answer:
      "Night distance is built for a short designated-driver hop. The first 10 km starts at LKR 1,800. Extra km and waiting after 15 minutes are listed on that page.",
  },
  {
    question: "When is night hourly better than distance?",
    answer:
      "When you will make several stops or sit somewhere for a while. Hourly packs have no waiting or distance charges inside the rules, and they end at 6:00 AM.",
  },
  {
    question: "What does the daytime package include?",
    answer:
      "Hourly chauffeur cover from 06:00 to 21:00, from LKR 3,000 for four hours. Extra hours after 9:00 PM or after 12 hours are LKR 500.",
  },
  {
    question: "Do you publish vehicle delivery prices?",
    answer:
      "Not until the owner confirms the old tier list. Ask for a quote with both addresses.",
  },
];

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
