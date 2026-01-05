"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useMenu } from "@/store/menu";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const { categories, upsertCategory, deleteCategory } = useMenu();
  const [name, setName] = React.useState("");

  function add() {
    const n = name.trim();
    if (!n) return;

    let base = slugify(n);
    if (!base) base = "category";

    let slug = base;
    let i = 2;
    while (categories.some((c) => c.slug === slug)) {
      slug = `${base}-${i++}`;
    }

    upsertCategory({ slug, name: n });
    setName("");
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <Card className="p-5 space-y-3">
        <p className="font-semibold">Add category</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input placeholder="Category name (e.g., Desserts)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={add}>
            Add
          </Button>
        </div>
        <p className="text-xs text-yum-text-secondary">
          Slug is created automatically. Delete is blocked if the category still has items.
        </p>
      </Card>

      <div className="grid gap-3">
        {categories.map((c) => (
          <Card key={c.slug} className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-yum-text-secondary">{c.slug}</p>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                const res = deleteCategory(c.slug);
                if (!res.ok) alert(res.reason);
              }}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </main>
  );
}