// tailwind.config.js
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode using class strategy
  theme: {
    extend: {
      spacing: {
        navbarHeight: "var(--navbar-height)",
        searchbarHeight: "var(--searchbar-height)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--clr-primary)", // Light mode primary
          dark: "var(--clr-primary-dark)", // Dark mode primary
        },
        input: "var(--input)",
      },
    },
  },
  plugins: [],
};
export default config;
