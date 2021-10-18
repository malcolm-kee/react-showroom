module.exports = {
  purge: [
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './src/**/*.md',
    './src/**/*.mdx',
    './docs/**/*.md',
    './docs/**/*.mdx',
    './docs/**/*.jsx',
    './docs/**/*.tsx',
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
