"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/cn";

export function navIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden min-w-0 flex-1 justify-center lg:flex">
      <ul className="flex items-center gap-0.5">
        {navLinks.map((item) => {
          const current = navIsActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "rounded-pill px-3 py-2 text-sm font-medium",
                  current
                    ? "bg-white/70 text-ink"
                    : "text-ink-muted hover:bg-white/70 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
