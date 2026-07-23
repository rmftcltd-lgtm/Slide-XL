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
        background: "var(--background)",
        foreground: "var(--foreground)",
        purple: {
          DEFAULT: "var(--purple)",
          deep: "var(--purple-deep)",
          bright: "var(--purple-bright)",
          soft: "var(--purple-soft)",
        },
        khaki: {
          DEFAULT: "var(--khaki)",
          deep: "var(--khaki-deep)",
        },
        ocean: {
          DEFAULT: "var(--ocean)",
          soft: "var(--ocean-soft)",
        },
        timber: "var(--timber)",
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
        },
        paper: "var(--paper)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        brand: "0 18px 50px -20px rgba(107, 45, 145, 0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
