import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist/types',
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@xui-design/shared', '@xui-design/utils'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'dist',
      },
    },
  },
});
