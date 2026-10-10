import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@xui/vue': resolve(rootDir, '../../packages/vue/src/index.ts'),
      '@xui/core': resolve(rootDir, '../../packages/core/src/index.ts'),
      '@xui/styles': resolve(rootDir, '../../packages/styles/src/index.scss'),
    },
  },
  server: {
    port: 5173,
  },
});
