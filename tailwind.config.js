/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["OpenDyslexic", "sans-serif"],
      },
      colors: {
        navy: "#0f172a",
        card: "#fefce8",
        accent: "#f59e0b",
        success: "#10b981",
      },
    },
  },
  plugins: [],
};
