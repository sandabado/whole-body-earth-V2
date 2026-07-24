import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "info" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: "border-flux bg-flux/10 text-flux",
  warning: "border-halo bg-halo/10 text-halo",
  info: "border-plasma bg-plasma/10 text-plasma",
  neutral: "border-mercury bg-mercury/20 text-ghost",
};

export function Badge({
  children,
  className,
  variant = "neutral",
  pulse = false,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border-2 px-3 py-1 text-center font-mono text-xs leading-relaxed uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {pulse && (
        <span
          className="h-2 w-2 animate-pulse rounded-full"
          style={{ backgroundColor: "currentColor" }}
        />
      )}
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}
