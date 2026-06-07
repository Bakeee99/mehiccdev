import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body:    ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563EB",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      backgroundImage: {
        "grid-pattern": `
          linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        "grid-md": "48px 48px",
      },
    },
  },
  plugins: [],
};

export default config;
