import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#1A5C3A",
          50: "#EAF4EE",
          100: "#C6E4D0",
          200: "#9DCFB1",
          300: "#73BA91",
          400: "#4AA572",
          500: "#2E8A56",
          600: "#1A5C3A",
          700: "#134528",
          800: "#0C2E18",
          900: "#061708",
        },
        slate: {
          DEFAULT: "#1E2D3D",
          50: "#F0F4F8",
          100: "#D9E3ED",
          200: "#B8CCDE",
          300: "#8AAEC9",
          400: "#5C8FB4",
          500: "#3E6E95",
          600: "#2E5478",
          700: "#1E3A5C",
          800: "#1E2D3D",
          900: "#111927",
        },
        offwhite: "#F8F7F4",
        success: "#4CAF72",
        warning: "#F5A623",
        danger: "#E53E3E",
        "text-primary": "#1E2D3D",
        "text-secondary": "#4A5C6B",
        "text-muted": "#8A9BB0",
        "border-light": "#E5EAF0",
        "border-medium": "#C8D4E0",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)",
        float: "0 8px 32px rgba(26,92,58,0.15)",
        "green-glow": "0 0 0 3px rgba(26,92,58,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "progress-fill": "progressFill 0.8s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progressFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
