/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pagebg': '#e5e5e5',
        'cardbg': '#fafafa',
        'cardhead': '#dbe7e4',
        'cardfoot': '#dbe7e4',
        'cardbutton': '#B6CEC8',
        'cardbuttonhover': '#9DBEB6',
        'cardbuttonfocus': '#78A59A',
        'cardoutline': '#525252',
        'button': '#74ABD2',
        'buttonhover': '#5698C8',
      }
    },
  },
  plugins: [],
}
