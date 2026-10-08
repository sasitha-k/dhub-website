import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-pill bg-badge px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
