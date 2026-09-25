import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        foreground: "#1C1C1A",
        primary: {
          DEFAULT: "#1F3A2E",
          light: "#2E5240",
          foreground: "#FAF9F6",
        },
        secondary: {
          DEFAULT: "#E9DCC9",
          foreground: "#1C1C1A",
        },
        muted: {
          DEFAULT: "#F1EFE9",
          foreground: "#6B6B63",
        },
        border: "#E5E1D8",
        card: "#FFFFFF",
        accent: "#C97B5A",
        success: "#3E7A4C",
        warning: "#C08A2E",
      },
      fontFamily: {
        // var(--font-serif) / var(--font-sans) come from next/font in
        // app/layout.tsx (Playfair Display / Inter). The old stack stays as
        // a fallback for the brief moment before the variable is set, and
        // for any rendering path that misses the html element's className.
        serif: [
          "var(--font-serif)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,28,26,0.04), 0 4px 16px rgba(28,28,26,0.06)",
        soft: "0 2px 8px rgba(28,28,26,0.06)",
        lift: "0 12px 24px rgba(28,28,26,0.10)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.09)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(16px, -12px) scale(1.06)" },
          "66%": { transform: "translate(-12px, 10px) scale(0.96)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "slide-in-right": "slide-in-right 0.25s ease-out both",
        "scale-in": "scale-in 0.2s ease-out both",
        float: "float 4s ease-in-out infinite",
        "ken-burns": "ken-burns 6s ease-in-out infinite alternate",
        blob: "blob 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;