/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx,html,css}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat'],
    },},
  },
  plugins: [],
  env: {
    API_SERVER_URL: process.env.API_SERVER_URL,
  }
}