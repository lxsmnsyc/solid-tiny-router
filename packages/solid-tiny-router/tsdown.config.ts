import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'neutral',
  target: 'es2017',
  dts: true,
  sourcemap: true,
  fixedExtension: false,
  // Solid's compiler runs in the consumer's bundler, so the JSX ships as-is.
  inputOptions: {
    transform: { jsx: 'preserve' },
  },
  outExtensions: () => ({ js: '.jsx' }),
});
