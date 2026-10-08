import { cn } from "@/lib/cn";

type SectionCardProps = {
  as?: "section" | "div" | "article";
  className?: string;
  id?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

export function SectionCard({
  as: Tag = "section",
  className,
  id,
  children,
  ref,
}: SectionCardProps) {
  return (
    <Tag
      ref={ref}
      id={id}
      className={cn(
        "dh-site-shell rounded-[28px] border border-white/55 p-[18px] backdrop-blur-2xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
