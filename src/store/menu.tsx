"use client";

import * as React from "react";
import type { Category, MenuItem } from "@/data/menu";
import { seedCategories, seedMenuItems } from "@/data/menu";

type MenuState = {
  categories: Category[];
  items: MenuItem[];
};

type MenuContextValue = MenuState & {
  getItemById: (id: string) => MenuItem | null;
  getItemsByCategory: (slug: string) => MenuItem[];
  upsertCategory: (c: Category) => void;
  deleteCategory: (slug: string) => { ok: true } | { ok: false; reason: string };
  upsertItem: (item: MenuItem) => void;
  deleteItem: (id: string) => void;
  resetToSeed: () => void;
};

const STORAGE_KEY = "yumyum_menu_v1";
const MenuContext = React.createContext<MenuContextValue | null>(null);

type Action =
  | { type: "HYDRATE"; state: MenuState }
  | { type: "UPSERT_CATEGORY"; category: Category }
  | { type: "DELETE_CATEGORY"; slug: string }
  | { type: "UPSERT_ITEM"; item: MenuItem }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "RESET" };

function uniqBySlug(list: Category[]) {
  const seen = new Set<string>();
  const out: Category[] = [];
  for (const c of list) {
    const slug = String(c.slug);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, name: String(c.name ?? slug) });
  }
  return out;
}

function uniqById(list: MenuItem[]) {
  const seen = new Set<string>();
  const out: MenuItem[] = [];
  for (const i of list) {
    const id = String(i.id);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({
      ...i,
      id,
      name: String(i.name ?? ""),
      description: String(i.description ?? ""),
      priceNaira: Number(i.priceNaira ?? 0),
      categorySlug: String(i.categorySlug ?? ""),
      image: String(i.image ?? ""),
      inStock: Boolean(i.inStock),
      prepMinutes: i.prepMinutes == null ? undefined : Number(i.prepMinutes),
      badge: i.badge,
      spicy: Boolean(i.spicy),
    });
  }
  return out;
}

function seedState(): MenuState {
  return {
    categories: uniqBySlug(seedCategories),
    items: uniqById(seedMenuItems),
  };
}

function reducer(state: MenuState, action: Action): MenuState {
  switch (action.type) {
    case "HYDRATE":
      return {
        categories: uniqBySlug(action.state.categories ?? seedCategories),
        items: uniqById(action.state.items ?? seedMenuItems),
      };

    case "UPSERT_CATEGORY": {
      const c = action.category;
      const categories = state.categories.some((x) => x.slug === c.slug)
        ? state.categories.map((x) => (x.slug === c.slug ? c : x))
        : [...state.categories, c];
      return { ...state, categories: uniqBySlug(categories) };
    }

    case "DELETE_CATEGORY": {
      return {
        ...state,
        categories: state.categories.filter((c) => c.slug !== action.slug),
      };
    }

    case "UPSERT_ITEM": {
      const it = action.item;
      const items = state.items.some((x) => x.id === it.id)
        ? state.items.map((x) => (x.id === it.id ? it : x))
        : [...state.items, it];
      return { ...state, items: uniqById(items) };
    }

    case "DELETE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "RESET":
      return seedState();

    default:
      return state;
  }
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, seedState());

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as MenuState;
      dispatch({ type: "HYDRATE", state: parsed });
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = React.useMemo<MenuContextValue>(() => {
    return {
      categories: state.categories,
      items: state.items,

      getItemById: (id) => state.items.find((x) => x.id === id) ?? null,
      getItemsByCategory: (slug) => state.items.filter((x) => x.categorySlug === slug),

      upsertCategory: (category) => dispatch({ type: "UPSERT_CATEGORY", category }),

      deleteCategory: (slug) => {
        const count = state.items.filter((i) => i.categorySlug === slug).length;
        if (count > 0) {
          return { ok: false as const, reason: "Category has items. Move/delete items first." };
        }
        dispatch({ type: "DELETE_CATEGORY", slug });
        return { ok: true as const };
      },

      upsertItem: (item) => dispatch({ type: "UPSERT_ITEM", item }),
      deleteItem: (id) => dispatch({ type: "DELETE_ITEM", id }),
      resetToSeed: () => dispatch({ type: "RESET" }),
    };
  }, [state]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}