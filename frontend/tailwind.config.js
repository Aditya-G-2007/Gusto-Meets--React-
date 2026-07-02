/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          green: '#33D19E', // <-- This is the green!
          purple: '#4A3AFF',
          pink: '#E58BF2',
          orange: '#FD5C43',
          yellow: '#FEC325',
          blue: '#75E2FF',
          bg: '#FBF5E9',
          surface: '#FFFFFF',
        }
      },
      boxShadow: {
        'neo-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '6px 6px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
