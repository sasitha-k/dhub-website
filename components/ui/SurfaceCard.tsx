import { cn } from "@/lib/cn";

type SurfaceCardProps = {
  as?: "div" | "article" | "section";
  className?: string;
  id?: string;
  children: React.ReactNode;
};

export function SurfaceCard({
  as: Tag = "div",
  className,
  id,
  children,
}: SurfaceCardProps) {
  return (
    <Tag id={id} className={cn("dh-surface-card rounded-xl", className)}>
      {children}
    </Tag>
  );
}
