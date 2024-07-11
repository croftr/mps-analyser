// tailwind.config.js
module.exports = {
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
          DEFAULT: "var(--clr-primary)",
          dark: "var(--clr-primary-dark)",
        },
        input: "var(--input)",
      },
      borderColor: { // Add this section
        DEFAULT: 'currentColor',
        input: 'var(--border-input)', // Map the CSS variable here
      },
    },
  },
  plugins: [],
};
