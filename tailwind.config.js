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
        'inno8': {
          'dark-blue': '#012340',
          'blue': '#0477BF',
          'orange': '#FCB316',
          'light-blue': '#048ABF'
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      keyframes: {
        splitUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        },
        splitDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      animation: {
        splitUp: 'splitUp 0.8s ease-in-out forwards',
        splitDown: 'splitDown 0.8s ease-in-out forwards'
      }
    },
  },
  plugins: [],
}