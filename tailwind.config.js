module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        "3vh": "3vh",
        "4vh": "4vh",
        "5vh": "5vh",
        "7vh": "7vh",
        "10vh": "10vh",
        "25vh": "25vh",
        "35vh": "35vh",
        "40vh": "40vh",
        "50vh": "50vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "85vh": "85vh",
        "90vh": "90vh",
        "100vh": "100vh",
        "120vh": "120vh",
        "200vh": "200vh",
        "3vw": "3vw",
        "4vw": "4vw",
        "5vw": "5vw",
        "7vw": "7vw",
        "10vw": "10vw",
        "25vw": "25vw",
        "35vw": "35vw",
        "30vw": "30vw",
        "40vw": "40vw",
        "45vw": "45vw",
        "50vw": "50vw",
        "75vw": "75vw",
        "80vw": "80vw",
        "85vw": "85vw",
        "90vw": "90vw",
        "100vw": "100vw",
        "120vw": "120vw",
        "200vw": "200vw"

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
        "120vh": "120vh",
        "200vh": "200vh"
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
