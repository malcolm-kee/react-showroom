module.exports = {
  purge: [
    './README.md',
    './docs/**/*.md',
    './docs/**/*.mdx',
    './components/**/*.jsx',
    './components/**/*.tsx',
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
