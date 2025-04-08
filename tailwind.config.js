/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update content paths to include all component files
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-orange)",
          light: "var(--primary-orange-light)",
          dark: "var(--primary-orange-dark)",
        },
        secondary: "var(--secondary-orange)",
        accent: "var(--accent-orange)",
        background: "var(--background-light)",
        textDark: "var(--text-dark)",
      },
    },
  },
  plugins: [],
};
