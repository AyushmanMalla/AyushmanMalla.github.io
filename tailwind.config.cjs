/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'background': '#000000',
        'primary': '#FE2600',
        'accent': '#FF5B3E',
        'secondary': '#FF917D',
        'dark-card': '#1E1E1E',
      },
      fontFamily: {
        sans: ['Atkinson', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};