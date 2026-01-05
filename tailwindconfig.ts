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
          primary: "#148A2F",
          pressed: "#0F6D25",
          deep: "#0B5C1F",
          sun: "#C9F7D3",
          black: "#000000",
        },
        yum: {
          bg: "#F2FFF4",
          surface: "#FFFFFF",
          text: {
            primary: "#071A0D",
            secondary: "#2C4A34",
          },
          border: "#D7E9DB",
          success: "#148A2F",
          warning: "#C9F7D3",
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