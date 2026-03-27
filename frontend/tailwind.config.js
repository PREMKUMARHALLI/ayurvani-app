/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ayur: {
          light: "#F9F7F3",
          primary: "#2C4C3B",
          accent: "#C0604A",
          dark: "#1A231E",
          muted: "#4A5D52",
          border: "#DDE3DD",
          success: "#4A7055",
          danger: "#B0413E",
          glow: "#89A897",
        },
      },
    },
  },
  plugins: [],
};

