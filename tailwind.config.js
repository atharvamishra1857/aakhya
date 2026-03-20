/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: "#8B2F4A",
          gold: "#F2D27A",
          cream: "#FFFEFA",
          light: "#FAF7F1",
          text: "#2B2F36",
        },
      },
      fontFamily: {
        brand: ["var(--font-brand)"],
      },
    },
  },
  plugins: [],
};
