export type Category = {
  slug: string;
  name: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceNaira: number;
  categorySlug: string;
  image: string; // local public path like "/images/chicken-1.jpg"
  inStock: boolean;
  prepMinutes?: number;

  badge?: "Popular" | "New" | "Value";
  spicy?: boolean;
};

export const seedCategories: Category[] = [
  { slug: "chicken-chips", name: "Chicken & Chips" },
  { slug: "turkey-chips", name: "Turkey & Chips" },
  { slug: "sides", name: "Sides" },
  { slug: "drinks", name: "Drinks" },
  { slug: "sauces-extras", name: "Sauces/Extras" },
];

/**
 * Put images in: public/images/
 * Chicken naming: chicken-1.jpg, chicken-2.jpg, chicken-3.jpg ...
 * Turkey naming:  turkey-1.jpg, turkey-2.jpg, turkey-3.jpg ...
 * Drinks/Extras naming: cocacola.jpg, fanta.jpg, ketchup.jpg (no spaces)
 */
export const seedMenuItems: MenuItem[] = [
  // =========================
  // CHICKEN & CHIPS
  // =========================
  {
    id: "chicken-1",
    name: "Chicken & Chips Box",
    description: "Crispy chicken with golden chips. Classic Yumyum favorite.",
    priceNaira: 4500,
    categorySlug: "chicken-chips",
    image: "/images/chicken-1.jpg",
    inStock: true,
    prepMinutes: 20,
    badge: "Popular",
  },
  {
    id: "chicken-2",
    name: "Chicken & Chips (Large)",
    description: "Bigger portion. More chicken, more chips.",
    priceNaira: 6000,
    categorySlug: "chicken-chips",
    image: "/images/chicken-2.jpg",
    inStock: true,
    prepMinutes: 25,
    badge: "Value",
  },
  {
    id: "chicken-3",
    name: "BBQ Chicken & Chips",
    description: "Sticky BBQ chicken with crunchy chips.",
    priceNaira: 5200,
    categorySlug: "chicken-chips",
    image: "/images/chicken-3.jpg",
    inStock: true,
    prepMinutes: 25,
  },
  {
    id: "chicken-4",
    name: "Spicy Chicken & Chips",
    description: "Hot and tasty chicken with chips.",
    priceNaira: 5300,
    categorySlug: "chicken-chips",
    image: "/images/chicken-4.jpg",
    inStock: true,
    prepMinutes: 25,
    spicy: true,
    badge: "Popular",
  },
  {
    id: "chicken-5",
    name: "Chicken Strips & Chips",
    description: "Tender strips with chips and dip.",
    priceNaira: 4800,
    categorySlug: "chicken-chips",
    image: "/images/chicken-5.jpg",
    inStock: true,
    prepMinutes: 20,
    badge: "New",
  },
  {
    id: "chicken-6",
    name: "Chicken Wings & Chips",
    description: "Juicy wings + chips. Perfect for cravings.",
    priceNaira: 5500,
    categorySlug: "chicken-chips",
    image: "/images/chicken-6.jpg",
    inStock: true,
    prepMinutes: 25,
  },

  // =========================
  // TURKEY & CHIPS
  // =========================
  {
    id: "turkey-1",
    name: "Turkey & Chips Combo",
    description: "Smoky turkey with crispy chips. Big flavor, big bite.",
    priceNaira: 5200,
    categorySlug: "turkey-chips",
    image: "/images/turkey-1.jpg",
    inStock: true,
    prepMinutes: 25,
    badge: "Popular",
  },
  {
    id: "turkey-2",
    name: "Spicy Turkey & Chips",
    description: "Spicy turkey + crunchy chips.",
    priceNaira: 5600,
    categorySlug: "turkey-chips",
    image: "/images/turkey-2.jpg",
    inStock: true,
    prepMinutes: 25,
    spicy: true,
  },
  {
    id: "turkey-3",
    name: "BBQ Turkey & Chips",
    description: "Saucy BBQ turkey paired with chips.",
    priceNaira: 5700,
    categorySlug: "turkey-chips",
    image: "/images/turkey-3.jpg",
    inStock: true,
    prepMinutes: 25,
    badge: "New",
  },
  {
    id: "turkey-4",
    name: "Turkey Bites & Chips",
    description: "Easy-to-eat turkey bites with chips and sauce.",
    priceNaira: 5400,
    categorySlug: "turkey-chips",
    image: "/images/turkey-4.jpg",
    inStock: true,
    prepMinutes: 22,
  },
  {
    id: "turkey-5",
    name: "Turkey Wings & Chips",
    description: "Turkey wings + chips with a rich dip.",
    priceNaira: 6200,
    categorySlug: "turkey-chips",
    image: "/images/turkey-5.jpg",
    inStock: true,
    prepMinutes: 30,
    badge: "Value",
  },

  // =========================
  // SIDES (you can add your own side images too)
  // =========================
  {
    id: "side-1",
    name: "Coleslaw",
    description: "Creamy, crunchy, and fresh.",
    priceNaira: 900,
    categorySlug: "sides",
    image: "/images/coleslaw.jpg",
    inStock: true,
    prepMinutes: 5,
  },
  {
    id: "side-2",
    name: "Plantain",
    description: "Sweet fried plantain.",
    priceNaira: 1300,
    categorySlug: "sides",
    image: "/images/plantain.jpg",
    inStock: true,
    prepMinutes: 10,
    badge: "Popular",
  },
  {
    id: "side-3",
    name: "Extra Chips",
    description: "Add more chips to your meal.",
    priceNaira: 1200,
    categorySlug: "sides",
    image: "/images/extrachips.jpg",
    inStock: true,
    prepMinutes: 8,
  },
  {
    id: "side-4",
    name: "Salad Bowl",
    description: "Fresh salad to balance your meal.",
    priceNaira: 1500,
    categorySlug: "sides",
    image: "/images/salad.jpg",
    inStock: true,
    prepMinutes: 8,
  },

  // =========================
  // DRINKS (no spaces in filenames)
  // =========================
  {
    id: "drink-1",
    name: "Coca‑Cola",
    description: "Chilled bottle/can (subject to availability).",
    priceNaira: 800,
    categorySlug: "drinks",
    image: "/images/cocacola.jpg",
    inStock: true,
    prepMinutes: 1,
  },
  {
    id: "drink-2",
    name: "Fanta",
    description: "Orange and refreshing.",
    priceNaira: 800,
    categorySlug: "drinks",
    image: "/images/fanta.jpg",
    inStock: true,
    prepMinutes: 1,
  },
  {
    id: "drink-3",
    name: "Sprite",
    description: "Crisp lemon-lime.",
    priceNaira: 800,
    categorySlug: "drinks",
    image: "/images/sprite.jpg",
    inStock: true,
    prepMinutes: 1,
  },
  {
    id: "drink-4",
    name: "Water",
    description: "Cold bottled water.",
    priceNaira: 500,
    categorySlug: "drinks",
    image: "/images/water.jpg",
    inStock: true,
    prepMinutes: 1,
  },

  // =========================
  // SAUCES / EXTRAS (no spaces in filenames)
  // =========================
  {
    id: "extra-1",
    name: "Pepper Sauce",
    description: "Hot pepper sauce (small cup).",
    priceNaira: 300,
    categorySlug: "sauces-extras",
    image: "/images/peppersauce.jpg",
    inStock: true,
    prepMinutes: 1,
    spicy: true,
  },
  {
    id: "extra-2",
    name: "BBQ Sauce",
    description: "Sweet BBQ sauce (small cup).",
    priceNaira: 300,
    categorySlug: "sauces-extras",
    image: "/images/bbqsauce.jpg",
    inStock: true,
    prepMinutes: 1,
  },
  {
    id: "extra-3",
    name: "Mayonnaise",
    description: "Creamy mayo (small cup).",
    priceNaira: 300,
    categorySlug: "sauces-extras",
    image: "/images/mayonnaise.jpg",
    inStock: true,
    prepMinutes: 1,
  },
  {
    id: "extra-4",
    name: "Ketchup",
    description: "Classic ketchup (small cup).",
    priceNaira: 300,
    categorySlug: "sauces-extras",
    image: "/images/ketchup.jpg",
    inStock: true,
    prepMinutes: 1,
  },
];