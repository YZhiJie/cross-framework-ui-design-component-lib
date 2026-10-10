import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, 'src/index.scss'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index'
          ? `index.${format === 'es' ? 'mjs' : 'cjs'}`
          : `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        dir: 'dist',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) {
            return 'index.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
});
