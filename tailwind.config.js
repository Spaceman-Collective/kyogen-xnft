/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        title: [
          "1.75rem",
          {
            lineHeight: "1.75rem",
            fontWeight: 800,
          },
        ],
      },
      colors: {
        'kyogen-primary': {
          DEFAULT: '#9448B1',
          light: '#B764D7',
          disabled: '#9F9F9F',
        },
        'kyogen-border': "#15171C",
        'kyogen-disabled': "#767676",
        'kyogen-fund-bg': 'rgb(var(--color-kyogen-fund-bg))'
      },
      fontFamily: {
        millimetre: ["Millimetre", "sans-serif"],
      },
    },
  },
  plugins: [],
};
