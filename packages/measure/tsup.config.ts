import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/measure.ts'],
  sourcemap: true,
  dts: true,
  format: ['cjs', 'esm'],
  legacyOutput: true,
});
