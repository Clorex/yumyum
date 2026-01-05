import * as React from "react";
import { cn } from "@/lib/cn";

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "h-10 px-4 rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
        "ring-1 ring-black/5",
        active
          ? "bg-brand-primary text-white"
          : "bg-white/70 text-yum-text-primary hover:bg-white",
        className
      )}
      {...props}
    />
  );
}