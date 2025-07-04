/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
 
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',

  ],

  theme: {
    extend: {

    fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
    },

    colors: {
        primary: "#FFFFFF",
        secondary: {
          DEFAULT: "#5bb450",
          50: "#a8d8a2",
          100: "#5bb450",
          200: "#5bb450",
          
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
          300: " #1E2A30",
      },
        gray: {
          100: "#CDCDE0",
          200 :'#E5E5E5',
          300: "#f8f8f8"
      },
    },


    spacing: {
        '5': '1.25rem',
        '6': '1.5rem',
        '30px': '30px',
        '4': '1rem',
        '12': '3rem',
      },
      
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px rgba(0, 0, 0, 0.2)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
        xl: '0 12px 24px rgba(0, 0, 0, 0.4)',
        '2xl': '0 16px 32px rgba(0, 0, 0, 0.5)',
        '3xl': '0 20px 40px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}