import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block font-mono text-xs uppercase tracking-wider text-ghost">
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={cn(
          "w-full rounded-xl border-2 border-mercury bg-carbon px-4 py-3 text-bone placeholder:text-ghost/60",
          "transition-colors duration-200 focus:border-plasma focus:ring-1 focus:ring-plasma focus:outline-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
