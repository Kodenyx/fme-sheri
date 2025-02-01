import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D6BCFA",
          foreground: "#4A5568",
        },
        secondary: {
          DEFAULT: "#E5DEFF",
          foreground: "#4A5568",
        },
        accent: {
          DEFAULT: "#FFDEE2",
          foreground: "#4A5568",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(102.3deg, rgba(214,188,250,1) 5.9%, rgba(229,222,255,1) 64%, rgba(255,222,226,1) 89%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;