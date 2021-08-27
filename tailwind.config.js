module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        "3vh": "3vh",
        "5vh": "5vh",
        "10vh": "10vh",
        "25vh": "25vh",
        "35vh": "35vh",
        "50vh": "50vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "85vh": "85vh",
        "100vh": "100vh",
        "200vh": "200vh",

      },

      minHeight: {
        "3vh": "3vh",
        "5vh": "5vh",
        "10vh": "10vh",
        "35vh": "35vh",
        "50vh": "50vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "85vh": "85vh",
        "100vh": "100vh",
        "200vh": "200vh",
      },

      width: {
        "31/64": "48.4375%",
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
