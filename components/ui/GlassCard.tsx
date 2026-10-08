import { cn } from "@/lib/cn";

type GlassCardProps = {
  as?: "div" | "article" | "section";
  className?: string;
  id?: string;
  tone?: "light" | "ink";
  children: React.ReactNode;
};

const tones = {
  light: "dh-glass-panel border-white/50 backdrop-blur-2xl",
  ink: "border-white/20 bg-brand-soft text-white shadow-[0_8px_30px_rgba(17,19,24,0.18)]",
} as const;

export function GlassCard({
  as: Tag = "div",
  className,
  id,
  tone = "light",
  children,
}: GlassCardProps) {
  return (
    <Tag
      id={id}
      className={cn("rounded-xl border", tones[tone], className)}
    >
      {children}
    </Tag>
  );
}
