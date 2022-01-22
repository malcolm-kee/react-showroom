module.exports = {
  content: [
    './README.md',
    './docs/**/*.md',
    './docs/**/*.mdx',
    './docs/**/*.tsx',
    './components/**/*.jsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        react: '#61dafb',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
