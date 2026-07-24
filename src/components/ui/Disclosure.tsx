import type { DetailsHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type DisclosureProps = Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  "children"
> & {
  summary: ReactNode;
  children: ReactNode;
  summaryClassName?: string;
  contentClassName?: string;
};

/** A native, keyboard-accessible disclosure with shared summary and indicator treatment. */
export function Disclosure({
  summary,
  children,
  className,
  summaryClassName,
  contentClassName,
  ...props
}: DisclosureProps) {
  return (
    <details {...props} className={cn("group", className)}>
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden",
          summaryClassName,
        )}
      >
        {summary}
        <svg
          aria-hidden="true"
          className="h-3 w-3 shrink-0 transition-transform duration-200 group-open:rotate-180"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className={contentClassName}>{children}</div>
    </details>
  );
}
