/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          deep:   '#0a1628',
          dark:   '#0d1f3c',
          mid:    '#1565c0',
          blue:   '#1976d2',
          light:  '#2196f3',
          glow:   '#42a5f5',
        },
        sz: {
          red:    '#e53935',
          redlt:  '#ff5252',
          success:'#00e676',
        }
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"Barlow"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
      }
    },
  },
  plugins: [],
}
