import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hud?: boolean;
  hoverEffect?: boolean;
}

export function Card({
  children,
  className,
  hud = true,
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-mercury bg-steel p-6",
        hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:border-plasma hover:shadow-[0_12px_32px_rgba(43,168,160,0.14)]",
        className,
      )}
      style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)", ...props.style }}
    >
      {hud && <div className="pointer-events-none absolute inset-2 rounded-xl border border-plasma/20" />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(43, 168, 160, 0.045) 50%)",
          backgroundSize: "100% 4px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
