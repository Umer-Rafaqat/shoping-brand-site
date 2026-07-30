/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Design was authored on a 1440px canvas. We treat 1440 as the max
      // content width and let everything scale down in % below that,
      // instead of hardcoding px widths — this is what keeps it responsive.
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
