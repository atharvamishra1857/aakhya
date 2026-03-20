/** @type {import('tailwindcss').Config} */
module.exports = {
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
          maroon: "#5D1224",
          gold: "#EAC775", /* Updated from #D4AF37 for WCAG AA contrast against maroon */
          cream: "#FDFBF7",
          light: "#F5F2EA",
          text: "#1F2937",
        },
      },

      fontFamily: {
        brand: ["var(--font-brand)"], // Now font-brand will work perfectly!
      },
    },
  },
  plugins: [],
};
