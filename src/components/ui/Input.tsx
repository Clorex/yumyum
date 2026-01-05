import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-3 h-12 px-4 rounded-lg bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]",
          "ring-1 ring-black/5",
          "focus-within:ring-2 focus-within:ring-brand-primary/30",
          className
        )}
      >
        {leftIcon ? (
          <span className="text-yum-text-secondary">{leftIcon}</span>
        ) : null}

        <input
          ref={ref}
          className="w-full bg-transparent outline-none text-yum-text-primary placeholder:text-yum-text-secondary"
          {...props}
        />

        {rightIcon ? (
          <span className="text-yum-text-secondary">{rightIcon}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";