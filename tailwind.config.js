/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Palette apaisante pour le journal de rêves
        primary: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d4fe',
          300: '#a5b8fc',
          400: '#8b96f8',
          500: '#7c6df1',
          600: '#6c4ee5',
          700: '#5e39ca',
          800: '#4e31a3',
          900: '#422e81',
        },
        dream: {
          night: '#1e1b4b',
          dusk: '#312e81',
          purple: '#6d28d9',
          lavender: '#a78bfa',
          moon: '#fef08a',
          cloud: '#f8fafc',
        },
      },
      fontFamily: {
        poppins: ['Poppins'],
        quicksand: ['Quicksand'],
      },
    },
  },
  plugins: [],
};

