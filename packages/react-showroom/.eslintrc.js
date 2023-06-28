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
    {
      files: ['**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
  },
};
