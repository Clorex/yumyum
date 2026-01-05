import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // From your palette image
          primary: "#F88601", // orange
          pressed: "#A73E14", // brown (pressed)
          deep: "#AC1A08", // deep red
          sun: "#FFBB35", // yellow highlight
          black: "#000000",
        },
        yum: {
          bg: "#FEE4CC", // peach background
          surface: "#FFF3E8", // soft surface cards/sections
          text: {
            primary: "#000000",
            secondary: "#3B2A21", // warm dark brown text
          },
          border: "#E9CDB7",
          success: "#2DBE60",
          warning: "#FFBB35",
          error: "#AC1A08",
        },
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "24px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.06)",
        modal: "0 12px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;