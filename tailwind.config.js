<<<<<<< HEAD
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
=======
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
>>>>>>> main
  ],
  theme: {
    extend: {},
  },
<<<<<<< HEAD
  darkMode: "class",
  plugins: [heroui()],
=======
  plugins: [],
>>>>>>> main
};
