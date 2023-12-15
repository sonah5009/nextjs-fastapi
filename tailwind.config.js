/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-yellow": "#fae64c",
        "primary-skyblue": "#afc0cf",
        surface: "#f2f2f2",
        "surface-dark": "#D9D9D9",
        onBackground: "#1b1b1b",
        background: "#FBFBFB",
        "onBackground-gray": "#9a9a9a",
      },
    },
  },
  plugins: [],
};
