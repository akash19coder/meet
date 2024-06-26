/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html,css}",
  ],
  important: '#root',
  theme: {
    extend: {
      screens: {
        'xs': '300px',
      },
    },
  },
  plugins: [],
}