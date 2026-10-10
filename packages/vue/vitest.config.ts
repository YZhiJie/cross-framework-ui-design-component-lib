import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // 组件为 SFC，测试编译需要 @vitejs/plugin-vue
  plugins: [vue()],
  test: {
    // Vue 适配层测试需要 DOM 环境
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**'],
      exclude: ['src/**/__tests__/**', 'src/**/index.ts', '**/*.d.ts', '**/*.css'],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 75,
      },
    },
  },
});
