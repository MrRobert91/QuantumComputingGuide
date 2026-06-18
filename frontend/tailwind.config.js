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
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,108,255,0.25), 0 8px 30px -8px rgba(124,108,255,0.35)",
        "glow-teal": "0 0 0 1px rgba(45,212,191,0.25), 0 10px 30px -10px rgba(45,212,191,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 10px 30px -15px rgba(0,0,0,0.6)",
        "card-lg": "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 50px -20px rgba(0,0,0,0.7)",
        nav: "0 -8px 30px -12px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(124,108,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,108,255,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.28s cubic-bezier(0.16,1,0.3,1)",
        "pop-in": "pop-in 0.25s cubic-bezier(0.16,1,0.3,1)",
        "rise-in": "rise-in 0.45s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
