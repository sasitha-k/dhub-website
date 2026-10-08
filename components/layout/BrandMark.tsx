import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const logos = {
  dark: {
    src: "/logo-dark.png",
    width: 1021,
    height: 164,
  },
  light: {
    src: "/logo-light.png",
    width: 996,
    height: 144,
  },
} as const;

export function BrandMark({
  variant = "light",
  className,
  priority = false,
}: {
  variant?: keyof typeof logos;
  className?: string;
  priority?: boolean;
}) {
  const logo = logos[variant];

  return (
    <Image
      src={logo.src}
      alt={site.name}
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={cn("w-auto", className ?? "h-5 sm:h-6")}
    />
  );
}
