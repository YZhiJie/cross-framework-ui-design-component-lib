import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // 根配置统一跑全仓测试（含 Vue SFC），需 @vitejs/plugin-vue 解析 .vue 文件
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['packages/**/src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['packages/*/src/**/*.ts'],
      exclude: [
        'packages/*/src/**/__tests__/**',
        'packages/*/src/**/*.d.ts',
        'packages/*/src/**/index.ts',
      ],
    },
  },
});
