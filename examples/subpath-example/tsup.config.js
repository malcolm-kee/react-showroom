import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/components/index.ts'],
  outDir: 'component-dts',
  dts: {
    only: true,
  },
});
