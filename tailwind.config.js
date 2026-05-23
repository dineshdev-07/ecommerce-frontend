/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
 theme: {
  extend: {
    colors: {
      brand: {
        primary: "#2E7D32",
        primaryDark: "#1B5E20",
        light: "#81C784",
        cream: "#FFF9C4",
        soft: "#F1F8E9",
        brown: "#795548",
        text: "#2E2A22",
      },
    },
  },
},
  plugins: [],
};
