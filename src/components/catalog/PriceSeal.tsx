import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const priceCls: Record<Size, string> = {
  sm: "text-[13px]",
  md: "text-[15px]",
  lg: "text-[18px]",
};
const labelCls: Record<Size, string> = {
  sm: "text-[8px]",
  md: "text-[9px]",
  lg: "text-[10px]",
};
const padCls: Record<Size, string> = {
  sm: "px-2 py-[3px] rounded-[4px]",
  md: "px-2.5 py-1 rounded-[5px]",
  lg: "px-3 py-1.5 rounded-[6px]",
};

/**
 * Minimal luxury price mark.
 * Soft ivory/cream with hairline gold ring — contrasts beautifully on dark imagery
 * and on the blue gradient CTA without competing for attention.
 */
export const PriceSeal = ({
  price,
  suffix = "notte",
  prefix = "da",
  size = "md",
  className,
}: {
  price: string;
  suffix?: string;
  prefix?: string;
  size?: Size;
  rotate?: number;
  className?: string;
}) => (
  <div
    style={{ fontFamily: "'Parkinsans', sans-serif" }}
    className={cn(
      "inline-flex items-baseline gap-1.5 select-none",
      "bg-gradient-to-br from-white/70 via-white/55 to-[hsl(38,35%,92%)]/55",
      "text-foreground ring-1 ring-inset ring-accent/35 backdrop-blur-md",
      "shadow-[0_4px_14px_-8px_rgba(0,0,0,0.25)]",
      padCls[size],
      className,
    )}
  >
    <span
      className={cn(
        "uppercase tracking-[0.22em] text-accent font-semibold",
        labelCls[size],
      )}
    >
      {prefix}
    </span>
    <span className={cn("font-bold tracking-tight text-foreground", priceCls[size])}>
      {price}
    </span>
    {suffix && (
      <span
        className={cn(
          "text-foreground/55 font-medium tracking-tight",
          labelCls[size],
        )}
      >
        / {suffix}
      </span>
    )}
  </div>
);

export default PriceSeal;
