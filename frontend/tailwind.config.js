/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF9F5",
          deep: "#F5F3ED",
          white: "#FFFFFE",
        },
        bluebrand: {
          DEFAULT: "#0000CD",
          dark: "#000099",
          light: "#E8EEFF",
          hover: "#1A1ACD",
          subtle: "rgba(0, 0, 205, 0.10)",
        },
        warm: {
          50: "#FAF9F7",
          100: "#F5F3EF",
          200: "#EBE8E2",
          300: "#DDD9D1",
          400: "#B5AFA5",
          500: "#8A8279",
          600: "#6B6359",
          700: "#4D463E",
          800: "#2D2825",
          900: "#1F1915",
        },
        safety: {
          DEFAULT: "#2D7A5E",
          bg: "#E8F4F0",
          border: "#3D8B6E",
        },
        editorial: {
          card: "#FFFFFE",
          border: "#EBE8E2",
          darkbg: "#1F1D1B",
          darkheader: "#2A2826",
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: ["Newsreader", "Georgia", "serif"],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Fira Code",
          "monospace",
        ],
      },
      boxShadow: {
        warm: "0 2px 8px rgba(31, 25, 21, 0.05)",
        "warm-md": "0 4px 12px rgba(31, 25, 21, 0.07)",
        "warm-lg": "0 8px 24px rgba(31, 25, 21, 0.09)",
        "blue-focus": "0 0 0 3px rgba(0, 0, 205, 0.18)",
      },
    },
  },
  plugins: [],
}