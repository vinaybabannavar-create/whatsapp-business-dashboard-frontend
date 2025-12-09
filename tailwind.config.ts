import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  // IMPORTANT: Tailwind must scan all folders where classes are used
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/store/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      // WhatsApp Color System (Custom)
      colors: {
        wa: {
          bg: "#111B21",
          surface: "#0A1014",
          primary: "#128C7E",
          accent: "#25D366",
          bubbleIncoming: "#202C33",
          bubbleOutgoing: "#005C4B",
        },
      },

      // Rounded components
      borderRadius: {
        xl: "1rem",
      },

      // Shadow enhancement (nice for cards)
      boxShadow: {
        soft: "0 2px 6px rgba(0, 0, 0, 0.2)",
      },
    },
  },

  plugins: [],
};

export default config;
