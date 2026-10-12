import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // React 19: 无需自动 JSX runtime 配置，plugin-react 已支持
    }),
    dts({
      entryRoot: 'src',
      outDir: 'dist/types',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
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
      // 函数式 external：匹配包名及其所有子路径（如 react-dom/client、react/jsx-runtime）
      // 字符串数组只能精确匹配，react-dom/client 会被打包进产物导致体积暴涨
      external: (id: string) =>
        [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'use-sync-external-store',
          'scheduler',
          '@xui/core',
          '@xui/shared',
          '@xui/styles',
          '@xui/icons',
        ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'dist',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
