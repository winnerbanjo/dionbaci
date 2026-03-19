import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
      colors: {
        ink: "#000000",
        paper: "#FFFFFF",
        mist: "#777777",
        line: "#E7E7E7",
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      boxShadow: {
        card: "0 24px 60px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
