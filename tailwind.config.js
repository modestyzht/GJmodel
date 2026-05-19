/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kumquat: {
          DEFAULT: '#F6A623',
          light: '#F8B84E',
        },
        orchard: {
          DEFAULT: '#45A86B',
          dark: '#2F7D4F',
        },
        beige: '#FFF8E8',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
