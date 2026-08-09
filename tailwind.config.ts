import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#F7EEDC",
          dark: "#1A130E",
        },
        ink: {
          DEFAULT: "#2C1B10",
          dark: "#F3E7D3",
        },
        muted: {
          DEFAULT: "#7C6952",
          dark: "#B9A588",
        },
        accent: {
          DEFAULT: "#A3382B",
          soft: "#F1DCC4",
        },
        success: "#4C7A3F",
        card: {
          DEFAULT: "#FFFBF2",
          dark: "#241A12",
        },
        gold: {
          DEFAULT: "#C9972E",
          soft: "#E9CD8C",
        },
        copper: "#B8703E",
        dusk: {
          top: "#2E2A54",
          mid: "#7A4A6B",
          bottom: "#E88A55",
        },
        checker: {
          cream: "#F1E6CE",
          navy: "#25344A",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        btn: "16px",
        card: "24px",
        search: "24px",
        qty: "20px",
        img: "20px",
      },
      spacing: {
        "1x": "8px",
        "2x": "16px",
        "3x": "24px",
        "4x": "32px",
        "6x": "48px",
        "8x": "64px",
        "12x": "96px",
        "16x": "128px",
      },
      maxWidth: {
        content: "1280px",
        reading: "760px",
        hero: "1100px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.04), 0 4px 12px rgba(17,17,17,0.04)",
        card: "0 2px 4px rgba(17,17,17,0.04), 0 8px 24px rgba(17,17,17,0.06)",
        lift: "0 8px 16px rgba(17,17,17,0.06), 0 16px 40px rgba(17,17,17,0.10)",
        glow: "0 0 0 4px rgba(163,56,43,0.16)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        swing: {
          "0%, 100%": { transform: "rotate(-2.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
        steam: {
          "0%": { transform: "translateY(0) scaleX(1)", opacity: "0" },
          "20%": { opacity: "0.5" },
          "100%": { transform: "translateY(-46px) scaleX(1.6)", opacity: "0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.9" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        swing: "swing 5s ease-in-out infinite",
        steam: "steam 3.5s ease-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        flicker: "flicker 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
