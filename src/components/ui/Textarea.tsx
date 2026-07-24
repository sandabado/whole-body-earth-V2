import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block font-mono text-xs uppercase tracking-wider text-ghost">
          {label}
        </label>
      )}
      <textarea
        {...props}
        id={textareaId}
        className={cn(
          "min-h-[120px] w-full resize-y rounded-xl border-2 border-mercury bg-carbon px-4 py-3 text-bone placeholder:text-ghost/60",
          "transition-colors duration-200 focus:border-plasma focus:ring-1 focus:ring-plasma focus:outline-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
