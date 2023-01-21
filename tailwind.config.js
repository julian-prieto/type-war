/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "var(--font-poppins)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { top: "50%", transform: "translateY(-50%) scale(1)" },
          "50%": { top: "50%", transform: "translateY(-50%) scale(0)" },
        },
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
