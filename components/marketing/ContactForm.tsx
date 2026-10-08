"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/content/services";
import { whatsappHref } from "@/lib/whatsapp";

const serviceOptions = [
  ...services.map((item) => item.name),
  "Night package",
  "Day package",
  "Other",
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(serviceOptions[0]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines = [
      "Hi Drivers Hub, I would like to book a chauffeur.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      date ? `Date: ${date}` : null,
      note ? `Note: ${note}` : null,
    ].filter(Boolean);
    window.location.href = whatsappHref(lines.join("\n"));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Name</span>
        <input
          required
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 rounded-md border border-line bg-card px-3 text-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Phone</span>
        <input
          required
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-11 rounded-md border border-line bg-card px-3 text-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Service type</span>
        <select
          name="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
          className="h-11 rounded-md border border-line bg-card px-3 text-ink"
        >
          {serviceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Date</span>
        <input
          name="date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="h-11 rounded-md border border-line bg-card px-3 text-ink"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Note</span>
        <textarea
          name="note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="rounded-md border border-line bg-card px-3 py-2 text-ink"
        />
      </label>
      <Button type="submit">Continue on WhatsApp</Button>
    </form>
  );
}
