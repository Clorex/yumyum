import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white/88 backdrop-blur",
        "ring-1 ring-black/5 shadow-[0_16px_50px_rgba(0,0,0,0.10)]",
        "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-r before:from-black/10 before:via-black/5 before:to-black/10",
        "before:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}