module.exports = {
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
  },
};
