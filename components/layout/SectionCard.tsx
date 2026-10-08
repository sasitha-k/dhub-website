import { cn } from "@/lib/cn";

type SectionCardProps = {
  as?: "section" | "div" | "article";
  className?: string;
  id?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

export function SectionCard({
  as = "section",
  className,
  id,
  children,
  ref,
}: SectionCardProps) {
  const props = {
    id,
    className: cn(
      "dh-site-shell rounded-[28px] border border-white/55 p-[18px] backdrop-blur-2xl",
      className,
    ),
    children,
  };

  if (as === "div") {
    return <div ref={ref as React.Ref<HTMLDivElement>} {...props} />;
  }

  if (as === "article") {
    return <article ref={ref} {...props} />;
  }

  return <section ref={ref} {...props} />;
}
