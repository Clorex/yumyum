"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useMenu } from "@/store/menu";
import type { MenuItem } from "@/data/menu";
import { formatNaira } from "@/lib/money";

function normalizeImage(v: string) {
  const s = v.trim();
  if (!s) return "";
  if (s.startsWith("/images/")) return s;
  if (s.startsWith("/")) return s;
  // allow user to type "chicken-7.jpg"
  return `/images/${s}`;
}

function safeInt(v: string, fallback = 0) {
  const n = Number(String(v).replace(/,/g, "").trim());
  if (!Number.isFinite(n)) return fallback;
  return Math.floor(n);
}

function nextIdFor(items: MenuItem[], prefix: string) {
  let max = 0;
  for (const it of items) {
    if (!it.id.startsWith(prefix + "-")) continue;
    const tail = it.id.slice(prefix.length + 1);
    const n = Number(tail);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return `${prefix}-${max + 1}`;
}

function defaultPrefix(categorySlug: string) {
  switch (categorySlug) {
    case "chicken-chips":
      return "chicken";
    case "turkey-chips":
      return "turkey";
    case "sides":
      return "side";
    case "drinks":
      return "drink";
    case "sauces-extras":
      return "extra";
    default:
      return "item";
  }
}

export default function AdminMenuPage() {
  const { categories, items, upsertItem, deleteItem, resetToSeed } = useMenu();

  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  const [editing, setEditing] = React.useState<MenuItem | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((i) => {
        const matchesCat = category === "all" ? true : i.categorySlug === category;
        const matchesQ =
          !query ||
          (i.name + " " + i.description + " " + i.id)
            .toLowerCase()
            .includes(query);
        return matchesCat && matchesQ;
      })
      .sort((a, b) => a.categorySlug.localeCompare(b.categorySlug));
  }, [items, q, category]);

  function startNew() {
    const defaultCategory = categories.find((c) => c.slug === "chicken-chips")
      ? "chicken-chips"
      : (categories[0]?.slug ?? "chicken-chips");

    const prefix = defaultPrefix(defaultCategory);
    const newId = nextIdFor(items, prefix);

    setError(null);
    setEditing({
      id: newId,
      name: "",
      description: "",
      priceNaira: 0,
      categorySlug: defaultCategory,
      image: `/images/${newId}.jpg`, // matches your naming style
      inStock: true,
      prepMinutes: 20,
      badge: undefined,
      spicy: false,
    });
  }

  function startEdit(it: MenuItem) {
    setError(null);
    setEditing({ ...it });
  }

  function save() {
    if (!editing) return;
    setError(null);

    const cleanId = editing.id.trim();
    if (!cleanId) {
      setError("ID is required (e.g., chicken-7).");
      return;
    }

    // Optional rule: if category is chicken/turkey, enforce naming
    if (editing.categorySlug === "chicken-chips" && !cleanId.startsWith("chicken-")) {
      setError("Chicken & Chips items should start with: chicken-");
      return;
    }
    if (editing.categorySlug === "turkey-chips" && !cleanId.startsWith("turkey-")) {
      setError("Turkey & Chips items should start with: turkey-");
      return;
    }

    // ensure unique id (unless editing same record)
    const exists = items.some((x) => x.id === cleanId);
    const editingOriginalId = editing.id; // current input value already
    // If ID changed to an existing one, block
    if (exists) {
      // If we are editing an existing item, exists is fine ONLY if it is that same one.
      // But since we don't keep "original id" separately, simplest: block only when there are 2+ with same id (shouldn't happen).
      const count = items.filter((x) => x.id === cleanId).length;
      if (count >= 1) {
        // If they’re editing an existing item, this is still OK.
        // But if they started "New" and picked an existing ID, it will overwrite.
        // We will prevent overwriting by requiring confirmation:
        const ok = confirm(
          "An item with this ID already exists. Saving will overwrite it. Continue?"
        );
        if (!ok) return;
      }
    }

    const price = safeInt(String(editing.priceNaira), 0);
    if (price < 0) {
      setError("Price must be 0 or more.");
      return;
    }

    const prep = editing.prepMinutes == null ? undefined : safeInt(String(editing.prepMinutes), 0);
    if (prep !== undefined && prep < 0) {
      setError("Prep minutes must be 0 or more.");
      return;
    }

    const cat = editing.categorySlug.trim();
    if (!cat) {
      setError("Category is required.");
      return;
    }

    const img = normalizeImage(editing.image);
    if (!img) {
      setError('Image is required (example: "chicken-7.jpg" or "/images/chicken-7.jpg").');
      return;
    }

    const cleaned: MenuItem = {
      id: cleanId,
      name: editing.name.trim() || cleanId,
      description: editing.description.trim(),
      priceNaira: price,
      categorySlug: cat,
      image: img,
      inStock: Boolean(editing.inStock),
      prepMinutes: prep === 0 ? undefined : prep,
      badge: editing.badge,
      spicy: Boolean(editing.spicy),
    };

    upsertItem(cleaned);
    setEditing(null);
  }

  function remove(id: string) {
    const ok = confirm("Delete this item?");
    if (!ok) return;
    deleteItem(id);
    if (editing?.id === id) setEditing(null);
  }

  function changeEditingCategory(newCat: string) {
    if (!editing) return;
    const prefix = defaultPrefix(newCat);
    const suggestedId = nextIdFor(items, prefix);
    setEditing((prev) => {
      if (!prev) return prev;
      // Keep their ID if it matches prefix, otherwise suggest a new one
      const keepId =
        (newCat === "chicken-chips" && prev.id.startsWith("chicken-")) ||
        (newCat === "turkey-chips" && prev.id.startsWith("turkey-")) ||
        (newCat === "sides" && prev.id.startsWith("side-")) ||
        (newCat === "drinks" && prev.id.startsWith("drink-")) ||
        (newCat === "sauces-extras" && prev.id.startsWith("extra-"));

      const id = keepId ? prev.id : suggestedId;
      const image = keepId ? prev.image : `/images/${id}.jpg`;

      return { ...prev, categorySlug: newCat, id, image };
    });
  }

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Menu items</h1>
          <p className="text-sm text-yum-text-secondary">
            Edit names, prices, stock, and image filenames (your files live in{" "}
            <span className="font-semibold">public/images</span>).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={startNew}>
            + New item
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const ok = confirm("Reset menu to seed data? This will overwrite your edits.");
              if (ok) resetToSeed();
            }}
          >
            Reset to seed
          </Button>
        </div>
      </div>

      <Card className="p-5 space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <Input
            placeholder="Search by name, description, or id (e.g., chicken-1)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="h-12 rounded-lg bg-white/70 ring-1 ring-black/10 px-3 flex items-center">
            <select
              className="w-full bg-transparent outline-none font-semibold"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-yum-text-secondary">
          Showing <span className="font-semibold text-brand-deep">{filtered.length}</span> items
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {/* List */}
        <div className="space-y-3">
          {filtered.map((it) => (
            <Card key={it.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{it.name}</p>
                  <p className="text-sm text-yum-text-secondary truncate">
                    {it.id} • {it.categorySlug}
                    {it.spicy ? " • Spicy" : ""}
                    {it.badge ? ` • ${it.badge}` : ""}
                  </p>
                  <p className="mt-1 font-extrabold text-brand-deep">
                    {formatNaira(it.priceNaira)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => startEdit(it)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand-deep hover:bg-brand-deep/10"
                    onClick={() => remove(it.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/70 ring-1 ring-black/10 font-bold">
                  {it.inStock ? "In stock" : "Out of stock"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/70 ring-1 ring-black/10 font-bold">
                  Image: {it.image}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:sticky lg:top-6 h-fit space-y-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">
                {editing ? "Edit item" : "No item selected"}
              </p>
              {editing ? (
                <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
                  Close
                </Button>
              ) : null}
            </div>

            {!editing ? (
              <p className="mt-2 text-sm text-yum-text-secondary">
                Click <span className="font-semibold">Edit</span> on an item or create a{" "}
                <span className="font-semibold">New item</span>.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {error ? (
                  <div className="p-3 rounded-lg bg-brand-deep/10 ring-1 ring-black/5">
                    <p className="text-sm font-semibold text-brand-deep">{error}</p>
                  </div>
                ) : null}

                <Input
                  placeholder="ID (e.g., chicken-7)"
                  value={editing.id}
                  onChange={(e) => setEditing((p) => (p ? { ...p, id: e.target.value } : p))}
                />

                <Input
                  placeholder="Name"
                  value={editing.name}
                  onChange={(e) => setEditing((p) => (p ? { ...p, name: e.target.value } : p))}
                />

                <Input
                  placeholder="Description"
                  value={editing.description}
                  onChange={(e) =>
                    setEditing((p) => (p ? { ...p, description: e.target.value } : p))
                  }
                />

                <Input
                  placeholder="Price (₦)"
                  value={String(editing.priceNaira ?? 0)}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, priceNaira: safeInt(e.target.value, 0) } : p
                    )
                  }
                  inputMode="numeric"
                />

                <div className="h-12 rounded-lg bg-white/70 ring-1 ring-black/10 px-3 flex items-center">
                  <select
                    className="w-full bg-transparent outline-none font-semibold"
                    value={editing.categorySlug}
                    onChange={(e) => changeEditingCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  placeholder='Image (e.g., "chicken-7.jpg" or "/images/chicken-7.jpg")'
                  value={editing.image}
                  onChange={(e) =>
                    setEditing((p) => (p ? { ...p, image: e.target.value } : p))
                  }
                />

                <Input
                  placeholder="Prep minutes (optional)"
                  value={editing.prepMinutes == null ? "" : String(editing.prepMinutes)}
                  onChange={(e) =>
                    setEditing((p) =>
                      p
                        ? {
                            ...p,
                            prepMinutes: e.target.value.trim()
                              ? safeInt(e.target.value, 0)
                              : undefined,
                          }
                        : p
                    )
                  }
                  inputMode="numeric"
                />

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-white/70 ring-1 ring-black/10">
                    <input
                      type="checkbox"
                      checked={Boolean(editing.inStock)}
                      onChange={(e) =>
                        setEditing((p) => (p ? { ...p, inStock: e.target.checked } : p))
                      }
                    />
                    <span className="font-semibold">In stock</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg bg-white/70 ring-1 ring-black/10">
                    <input
                      type="checkbox"
                      checked={Boolean(editing.spicy)}
                      onChange={(e) =>
                        setEditing((p) => (p ? { ...p, spicy: e.target.checked } : p))
                      }
                    />
                    <span className="font-semibold">Spicy</span>
                  </label>
                </div>

                <div className="h-12 rounded-lg bg-white/70 ring-1 ring-black/10 px-3 flex items-center">
                  <select
                    className="w-full bg-transparent outline-none font-semibold"
                    value={editing.badge ?? ""}
                    onChange={(e) =>
                      setEditing((p) =>
                        p
                          ? {
                              ...p,
                              badge: e.target.value
                                ? (e.target.value as MenuItem["badge"])
                                : undefined,
                            }
                          : p
                      )
                    }
                  >
                    <option value="">No badge</option>
                    <option value="Popular">Popular</option>
                    <option value="New">New</option>
                    <option value="Value">Value</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={save}>
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const ok = confirm("Delete this item?");
                      if (ok) remove(editing.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>

                <p className="text-xs text-yum-text-secondary">
                  Tip: If you type only <span className="font-semibold">chicken-8.jpg</span> we
                  automatically store it as <span className="font-semibold">/images/chicken-8.jpg</span>.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}