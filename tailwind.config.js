/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#042940',
        'weather-primary-hover': '#005C53',
        'weather-secondary': '#9FC131',
        'weather-background-off-white': '#ECEFF3',
        'weather-app-to-secondary': '#D6D58E',
      },
    },
  },
  plugins: [],
};
