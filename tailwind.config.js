/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        en: ["Inter", "sans-serif"],
        th: ["Noto Sans Thai", "sans-serif"],
      },
    },
  },
  plugins: [],
};
