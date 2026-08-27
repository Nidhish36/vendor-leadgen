/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090a0f',
        cardBg: 'rgba(17, 18, 27, 0.7)',
        borderBg: 'rgba(255, 255, 255, 0.08)',
        brandPrimary: '#6366f1',
        brandSecondary: '#a855f7',
      }
    },
  },
  plugins: [],
}
