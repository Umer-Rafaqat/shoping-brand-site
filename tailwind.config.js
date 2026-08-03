/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      
      maxWidth: {
        container: "1440px",
      },
      colors: {
        border: "hsl(var(--border))",
        black: {
          DEFAULT: "#000000",
          60: "#00000099",
        },
        surface: {
          100: "#F0F0F0", // dress-style section / footer bg
          200: "#F2F0F1", // hero bg
        },
        brand: {
          red: "#FF3333",
          pink: "#FFECEB",
          yellow: "#FFC633",
        },
      },
      fontFamily: {
        // Integral CF is a paid font — Clash Display is the closest free
        // geometric-sans substitute. Swap in the real Integral CF file
        // in index.css once you have a license.
        integral: ['"Integral CF"', '"Clash Display"', "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
