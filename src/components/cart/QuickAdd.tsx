"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";

export function QuickAdd({
  itemId,
  disabled,
}: {
  itemId: string;
  disabled?: boolean;
}) {
  const { lines, add, setQty, remove } = useCart();

  const qty = React.useMemo(() => {
    return lines.find((l) => l.itemId === itemId)?.quantity ?? 0;
  }, [lines, itemId]);

  // Always show a BIG button if not added yet
  if (qty <= 0) {
    return (
      <Button
        disabled={disabled}
        className="w-full h-12 rounded-2xl"
        onClick={() => add(itemId, 1)}
      >
        Add to order
      </Button>
    );
  }

  // After added: show stepper + a smaller button feel
  return (
    <div className="w-full flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        className="h-12 w-12 rounded-2xl text-lg"
        disabled={disabled}
        onClick={() => {
          const next = qty - 1;
          if (next <= 0) remove(itemId);
          else setQty(itemId, next);
        }}
      >
        –
      </Button>

      <div className="flex-1 h-12 rounded-2xl bg-white/80 ring-1 ring-black/10 flex items-center justify-center">
        <span className="font-extrabold text-[color:var(--deep)] text-lg">{qty}</span>
      </div>

      <Button
        variant="secondary"
        className="h-12 w-12 rounded-2xl text-lg"
        disabled={disabled}
        onClick={() => setQty(itemId, Math.min(20, qty + 1))}
      >
        +
      </Button>
    </div>
  );
}