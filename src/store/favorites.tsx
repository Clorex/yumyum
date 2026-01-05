"use client";

import * as React from "react";

type FavoritesContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
};

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "yumyum_favorites_v1";

type Action =
  | { type: "HYDRATE"; ids: string[] }
  | { type: "TOGGLE"; id: string }
  | { type: "CLEAR" };

function uniq(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function reducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case "HYDRATE":
      return uniq(Array.isArray(action.ids) ? action.ids : []);
    case "TOGGLE": {
      const exists = state.includes(action.id);
      return exists ? state.filter((x) => x !== action.id) : uniq([action.id, ...state]);
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, dispatch] = React.useReducer(reducer, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      dispatch({ type: "HYDRATE", ids: parsed });
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids]);

  const value = React.useMemo<FavoritesContextValue>(() => {
    return {
      ids,
      has: (id) => ids.includes(id),
      toggle: (id) => dispatch({ type: "TOGGLE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [ids]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}