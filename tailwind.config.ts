import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0E14",
        "obsidian-light": "#12161F",
        "obsidian-lighter": "#1A1F2E",
        "obsidian-card": "#151A26",
        "ferrari-red": "#E5053A",
        "rb-blue": "#0600EF",
        "mercedes-cyan": "#00F5D4",
        "mclaren-papaya": "#FF8000",
        "aston-green": "#006F62",
        "williams-blue": "#005AFF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "scan-line": "scan-line 3s linear infinite",
        "telemetry-flow": "telemetry-flow 2s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "telemetry-flow": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
