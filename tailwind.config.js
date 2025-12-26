/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B1F3B',
          'navy-dark': '#081628',
          'navy-light': '#1a2f4f',
          blue: '#1E3A8A',
          gray: '#4B5563',
          slate: '#334155',
          gold: '#C1A24A',
          bg: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
        arabic: ['"Noto Naskh Arabic"', 'serif'],
      },
      maxWidth: {
        content: '1600px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-rtl'),
  ],
};
