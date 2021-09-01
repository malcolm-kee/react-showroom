export const createBabelConfig = (env: 'development' | 'production') => {
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: 'entry',
          // Set the corejs version we are using to avoid warnings in console
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          runtime: 'automatic',
          development: env === 'development',
        },
      ],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      require.resolve('babel-plugin-macros'),
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
        },
      ],
    ],
  };
};
