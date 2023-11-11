/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors:{
        'fig': '#BABABA',
        'but': '#00789E'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans'],
        outfit: ['Outfit', 'sans'],
        cursive: ['Agbalumo', 'cursive'],
      },
    },
    corePlugins: {
      aspectRatio: false,
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('flowbite/plugin'),
    require("daisyui"),
  ],
});



