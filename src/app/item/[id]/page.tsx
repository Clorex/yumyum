"use client";

import { useParams } from "next/navigation";
import { useMenu } from "@/store/menu";
import { ItemDetails } from "@/components/item/ItemDetails";

export default function ItemPage() {
  const params = useParams<{ id: string }>();
  const { getItemById } = useMenu();

  const id = params.id;
  const item = getItemById(id);

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Item not found</h1>
        <p className="mt-2 text-yum-text-secondary">This item may have been removed.</p>
      </main>
    );
  }

  return <ItemDetails item={item} />;
}