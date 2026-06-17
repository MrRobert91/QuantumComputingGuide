/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        quantum: {
          bg: "#070a13",
          bg2: "#0b0f1a",
          panel: "#121829",
          panel2: "#1a2236",
          border: "#26304a",
          accent: "#7c6cff",
          accent2: "#2dd4bf",
          accent3: "#f472b6",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,108,255,0.25), 0 8px 30px -8px rgba(124,108,255,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 30px -15px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
        "pop-in": "pop-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
