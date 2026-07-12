/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#E66A1B',
        maroon: '#7A1D1D',
        gold: '#D4AF37',
        cream: '#FFF8EE'
      },
      fontFamily: {
        heading: ['"Tiro Devanagari Hindi"', 'serif'],
        body: ['"Mukta"', 'sans-serif']
      }
    }
  },
  plugins: []
};
