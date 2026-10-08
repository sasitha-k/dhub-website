"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { navIsActive } from "@/components/layout/NavLinks";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/cn";

export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const panel = (
    <div
      id="mobile-nav"
      hidden={!open}
      className={cn(
        "fixed inset-x-4 top-[5.5rem] z-55 rounded-xl border border-white/55 bg-white/55 p-3 shadow-glass backdrop-blur-3xl backdrop-saturate-150 lg:hidden",
        open ? "block" : "hidden",
      )}
    >
      <nav aria-label="Mobile">
        <ul className="flex flex-col gap-1">
          {navLinks.map((item) => {
            const current = navIsActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "block rounded-pill px-3 py-2 text-sm font-medium",
                    current
                      ? "bg-white text-ink"
                      : "text-ink hover:bg-white/70",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-card text-ink backdrop-blur-xl"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}
