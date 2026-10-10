import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
    alias: {
      '@xui/vue': resolve(rootDir, '../../packages/vue/src/index.ts'),
      '@xui/react': resolve(rootDir, '../../packages/react/src/index.ts'),
      '@xui/core': resolve(rootDir, '../../packages/core/src/index.ts'),
      '@xui/styles': resolve(rootDir, '../../packages/styles/src/index.scss'),
    },
  },
  server: {
    port: 5175,
  },
});
