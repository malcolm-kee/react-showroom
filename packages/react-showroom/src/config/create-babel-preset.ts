import { Environment } from '@showroomjs/core';

export const createBabelPreset = (env: Environment) => {
  const runTimeVersion = (function getBabelRuntimeVersion():
    | string
    | undefined {
    try {
      return require('@babel/runtime/package.json').version;
    } catch (err) {}
  })();

  const isDev = env === 'development';
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
          development: isDev,
        },
      ],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          version: runTimeVersion,
          absoluteRuntime: true,
        },
      ],
    ],
  } as const;
};
