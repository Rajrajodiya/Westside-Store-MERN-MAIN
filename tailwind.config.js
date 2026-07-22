/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ['SF Pro Display', 'Helvetica Neue', 'sans-serif'],
        body: ['SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'apple-black': '#000',
        'apple-gray-100': '#f5f5f7',
        'apple-gray-200': '#e8e8ed',
        'apple-gray-300': '#d2d2d7',
        'apple-gray-400': '#a1a1a6',
        'apple-gray-500': '#86868b',
        'apple-gray-600': '#6e6e73',
        'apple-gray-700': '#424245',
        'apple-gray-800': '#1d1d1f',
        'apple-blue': '#0066cc',
        'apple-blue-hover': '#0077ed',
        'apple-white': '#ffffff',
      },
      borderRadius: {
        'apple-sm': '6px',
        'apple-md': '14px',
        'apple-lg': '18px',
        'apple-pill': '9999px',
      },
    },
  },
  plugins: [],
}

