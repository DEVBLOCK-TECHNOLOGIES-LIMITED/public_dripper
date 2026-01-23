/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Luxury Black Palette
        noir: {
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d1d1d1",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#3d3d3d",
          700: "#262626",
          800: "#171717",
          900: "#0a0a0a",
          950: "#030303",
        },
        // Luxurious Gold Palette
        gold: {
          50: "#fefbf3",
          100: "#fdf6e3",
          200: "#f9e8c0",
          300: "#f5d89a",
          400: "#e8c252",
          500: "#d4af37", // Primary Gold
          600: "#b8942f",
          700: "#997827",
          800: "#7a5f20",
          900: "#5c4718",
          950: "#3d2f10",
        },
        // Champagne / Cream
        champagne: {
          50: "#fdfcfa",
          100: "#f9f6f0",
          200: "#f5e6d3",
          300: "#ecdbc3",
          400: "#e0c9aa",
          500: "#d4b896",
        },
        // Rose Gold Accent
        rosegold: {
          300: "#d4a5a5",
          400: "#c48f8f",
          500: "#b76e79",
          600: "#a05a64",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        opensans: ['"Open Sans"', "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(212, 175, 55, 0.3), 0 0 10px rgba(212, 175, 55, 0.2)",
          },
          "100%": {
            boxShadow:
              "0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #d4af37 0%, #f5d89a 50%, #d4af37 100%)",
        "gold-shimmer":
          "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)",
      },
    },
  },
  plugins: [],
};
