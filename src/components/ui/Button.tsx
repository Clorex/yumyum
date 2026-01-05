import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl transition-all font-semibold " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/30 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--sun)] to-[color:var(--primary-pressed)] " +
    "shadow-[0_14px_30px_rgba(248,134,1,0.28)] hover:brightness-[1.03] active:brightness-[0.98]",
  secondary:
    "bg-white/85 text-[color:var(--text-primary)] ring-1 ring-black/10 hover:bg-white active:bg-white/90",
  ghost: "bg-transparent text-[color:var(--deep)] hover:bg-[color:var(--primary)]/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";