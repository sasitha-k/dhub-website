"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { availabilityOptions, licenceOptions } from "@/content/careers";
import { whatsappHref } from "@/lib/whatsapp";

const fieldClass =
  "h-11 rounded-md border border-line bg-card px-3 text-ink";

export function ChauffeurApplyForm() {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const note = String(data.get("note") ?? "").trim();
    const lines = [
      "Chauffeur application — Drivers Hub",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Area: ${data.get("area")}`,
      `Years driving: ${data.get("years")}`,
      `Licence: ${data.get("licence")}`,
      `Availability: ${data.get("availability")}`,
      note ? `Note: ${note}` : null,
    ].filter(Boolean);
    window.location.href = whatsappHref(lines.join("\n"));
  }

  return (
    <form method="dialog" onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Full name</span>
        <input
          required
          autoComplete="name"
          name="name"
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Phone</span>
        <input
          required
          autoComplete="tel"
          name="phone"
          type="tel"
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Area you live in</span>
        <input
          required
          name="area"
          className={fieldClass}
          placeholder="Colombo, Kotte, or nearby"
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Years driving</span>
        <input
          required
          name="years"
          type="number"
          inputMode="numeric"
          min={0}
          max={60}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Licence</span>
        <select
          required
          name="licence"
          defaultValue={licenceOptions[0]}
          className={fieldClass}
        >
          {licenceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Availability</span>
        <select
          required
          name="availability"
          defaultValue={availabilityOptions[2]}
          className={fieldClass}
        >
          {availabilityOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium text-ink">Note</span>
        <textarea
          name="note"
          rows={4}
          className="rounded-md border border-line bg-card px-3 py-2 text-ink"
          placeholder="Luxury cars, outstation, or anything we should know"
        />
      </label>
      <Button type="submit">Apply on WhatsApp</Button>
      <p className="text-xs leading-5 text-ink-muted">
        By sending this you share the details above on WhatsApp. See the{" "}
        <Link className="underline" href="/privacy">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
