import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-soft focus-visible:outline-brand",
  glass:
    "border border-white/15 bg-glass-fill text-white backdrop-blur-xl hover:bg-white/15 focus-visible:outline-white",
  outline:
    "border border-white/60 bg-white/35 text-ink backdrop-blur-xl hover:bg-white/55 focus-visible:outline-brand",
} as const;

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "href" | "className"> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className"> & {
    href?: never;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function isExternalHref(href: string) {
  return (
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  );
}

function classes(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-[color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classNames = classes(variant, size, className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;

    if (isExternalHref(href)) {
      return (
        <a href={href} className={classNames} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classNames} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } =
    props as ComponentPropsWithoutRef<"button">;

  return (
    <button type={type} className={classNames} {...buttonRest}>
      {children}
    </button>
  );
}
