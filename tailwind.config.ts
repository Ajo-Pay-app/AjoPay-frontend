import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ajo: {
          green: "#0B6E4F",
          gold: "#E8A33D",
          ink: "#0F172A",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
