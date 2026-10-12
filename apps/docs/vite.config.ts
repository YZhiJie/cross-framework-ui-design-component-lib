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
      '@xui-design/vue': resolve(rootDir, '../../packages/vue/src/index.ts'),
      '@xui-design/react': resolve(rootDir, '../../packages/react/src/index.ts'),
      '@xui-design/core': resolve(rootDir, '../../packages/core/src/index.ts'),
      '@xui-design/styles': resolve(rootDir, '../../packages/styles/src/index.scss'),
    },
  },
  server: {
    port: 5175,
  },
});
