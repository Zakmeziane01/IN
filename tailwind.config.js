/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#68DF5A",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        
        secondaryBgColor: "#FF9C01",  // Assuming this is secondary background color
        borderColor1: "#68DF5A",      // Assuming this is border color 1
        themeColorMain: "#CDCDE0",    // Assuming this is theme color main
        textColorSecondary: "#232533" // Assuming this is text color secondary
      },
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
      borderRadius: {
        'custom': '0 0 10px 10px',
        '20px': '20px',
      },
      padding: {
        '2em': '2em',
        '1em': '1em',
        '0.5em': '0.5em',
      },
      margin: {
        '1em': '1em',
        '0.5em': '0.5em',
      },
      gap: {
        '0.5em': '0.5em',
      },
      width: {
        'fit-content': 'fit-content',
      },
      maxWidth: {
        'full': '100%',
      },
      flex: {
        'wrap': 'wrap',
        'column': 'column',
        'justify-end': 'justify-end',
      },
      display: {
        'flex': 'flex',
      },
      wordWrap: {
        'break-word': 'break-word',
      }
    },
  },
  plugins: [],
}

