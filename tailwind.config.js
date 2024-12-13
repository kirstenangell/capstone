/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
  
      },
      fontWeight: {
        'extra-light': 200,  // Custom weight
        'light': 300,        // Custom weight
        'normal': 400,       // Default weight
        'medium': 500,       // Default weight
        'semi-bold': 600,    // Default weight
        'bold': 700,         // Default weight
        'extra-bold': 800,   // Custom weight
        'black': 900,        // Custom weight
      },
    },
  },
  plugins: [],
}

