import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: false;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ChildButtonProps = {
  asChild: true;
  children: ReactElement<{ className?: string }>;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-plasma text-void hover:bg-flux hover:text-void",
  secondary:
    "bg-carbon text-bone border-2 border-mercury hover:border-plasma hover:text-plasma",
  outline:
    "bg-transparent text-bone border-[3px] border-solid border-mercury hover:border-plasma",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button(props: ButtonProps | ChildButtonProps) {
  const {
    children,
    className,
    asChild,
    variant = "primary",
    size = "md",
    ...rest
  } = props;
  const buttonClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-plasma focus:ring-offset-2 focus:ring-offset-void",
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(buttonClasses, child.props.className),
    });
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} className={buttonClasses}>
      {children as ReactNode}
    </button>
  );
}
