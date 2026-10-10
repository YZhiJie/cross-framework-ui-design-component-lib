import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@xui/react': resolve(rootDir, '../../packages/react/src/index.ts'),
      '@xui/core': resolve(rootDir, '../../packages/core/src/index.ts'),
      '@xui/styles': resolve(rootDir, '../../packages/styles/src/index.scss'),
    },
  },
  server: {
    port: 5174,
  },
});
