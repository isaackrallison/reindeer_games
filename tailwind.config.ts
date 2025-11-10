import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reindeer Games Color Palette
        reindeer: {
          // Primary colors from logo
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444", // Main red (reindeer nose)
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            950: "#450a0a",
          },
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e", // Main green (festive)
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16",
          },
          gold: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b", // Main gold (game elements)
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
            950: "#451a03",
          },
          brown: {
            50: "#fdf4e8",
            100: "#f9e6cc",
            200: "#f3cc99",
            300: "#ecb066",
            400: "#e49433",
            500: "#d97706", // Reindeer fur
            600: "#b85c00",
            700: "#974500",
            800: "#762e00",
            900: "#551700",
            950: "#330a00",
          },
          navy: {
            50: "#f0f4f8",
            100: "#d9e2ec",
            200: "#bcccdc",
            300: "#9fb3c8",
            400: "#829ab1",
            500: "#627d98", // Winter night
            600: "#486581",
            700: "#334e68",
            800: "#243b53",
            900: "#102a43",
            950: "#0a1929",
          },
          cream: {
            50: "#fefcf9",
            100: "#fdf8f0",
            200: "#faf0e1",
            300: "#f6e8d2",
            400: "#f2e0c3",
            500: "#eed8b4", // Warm background
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;

