module.exports = {
  purge: [
    './README.md',
    './docs/**/*.md',
    './docs/**/*.mdx',
    './docs/**/*.tsx',
    './components/**/*.jsx',
    './components/**/*.tsx',
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        react: '#61dafb',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
