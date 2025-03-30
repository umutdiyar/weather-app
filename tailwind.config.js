/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#141318',
        'weather-primary-hover': '#282C35',
        'weather-secondary': '#CAF205',
        'weather-background-off-white': '#ECEFF3',
      },
    },
  },
  plugins: [],
}
