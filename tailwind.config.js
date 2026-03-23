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
          bgprimary: "var(--color-bg-primary)",
          bgsecondary: "var(--color-bg-secondary)",
          bgdark: "var(--color-bg-dark)",
          rose: "var(--color-brand-rose)",
          sage: "var(--color-brand-sage)",
          blue: "var(--color-brand-blue)",
          ink: "var(--color-text-primary)",
          gray: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          ivory: "var(--color-text-ivory)",
          borderlight: "var(--color-border-light)",
          borderrose: "var(--color-border-rose)"
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-display-fallback)"],
        body: ["var(--font-body)", "var(--font-body-fallback)"],
        accent: ["var(--font-accent)", "var(--font-accent-fallback)"],
      },
    },
  },
  plugins: [],
};
