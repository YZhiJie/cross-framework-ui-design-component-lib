import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Vue 适配层测试需要 DOM 环境
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['src/**/__tests__/**/*.test.ts'],
  },
});
