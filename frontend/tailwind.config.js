/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: "#0b0f1a",
          panel: "#141a2b",
          accent: "#6e5cf6",
          accent2: "#22d3ee",
        },
      },
    },
  },
  plugins: [],
};
