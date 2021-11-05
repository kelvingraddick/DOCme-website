module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        white: 'white',
        highLight: 'rgba(255, 255, 255, 0.05)',
        lightGray: '#dfdfdf',
        //gray: 'gray',
        darkGray: '#4f4f4f',
        green: '#00a79d',
        lightBlue: '#0b75c1',
        mediumBlue: '#114b79',
        darkBlue: '#213068',
        red: '#ff4f5a'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
