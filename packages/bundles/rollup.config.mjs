// @ts-check

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

/**
 *
 * @returns {import('rollup').RollupOptions}
 */
const createSharedOptions = () => ({
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        global: 'globalThis',
      },
      preventAssignment: true,
    }),
  ],
  external: ['react', 'react-dom', 'prop-types', 'tslib'],
});

export default defineConfig([
  {
    input: 'src/routing.ts',
    output: {
      file: 'dist/routing.js',
      format: 'esm',
      sourcemap: true,
    },
    ...createSharedOptions(),
  },
  {
    input: 'src/routing.ts',
    output: {
      file: 'dist/routing.cjs',
      format: 'commonjs',
      sourcemap: true,
    },
    ...createSharedOptions(),
  },
  {
    input: 'src/query.ts',
    output: {
      file: 'dist/query.js',
      format: 'esm',
      sourcemap: true,
    },
    ...createSharedOptions(),
  },
  {
    input: 'src/query.ts',
    output: {
      file: 'dist/query.cjs',
      format: 'commonjs',
      sourcemap: true,
    },
    ...createSharedOptions(),
  },
  {
    input: 'src/react-simple-code-editor.ts',
    output: {
      file: 'dist/react-simple-code-editor.js',
      format: 'esm',
      sourcemap: true,
    },
    ...createSharedOptions(),
  },
  {
    input: 'src/react-simple-code-editor.ts',
    output: {
      file: 'dist/react-simple-code-editor.cjs',
      format: 'commonjs',
      sourcemap: true,
    },
    ...createSharedOptions(),
  },
]);
