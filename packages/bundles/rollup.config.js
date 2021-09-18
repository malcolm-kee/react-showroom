import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: 'src/routing.ts',
    output: {
      file: 'dist/routing.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs(), typescript()],
    external: ['react', 'react-dom', 'prop-types', 'tslib'],
  },
  {
    input: 'src/query.ts',
    output: {
      file: 'dist/query.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs(), typescript()],
    external: ['react', 'react-dom', 'prop-types', 'tslib'],
  },
]);
