import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 纯逻辑层：Node 环境即可，无需 jsdom
    environment: 'node',
    passWithNoTests: true,
    include: ['src/**/__tests__/**/*.test.ts'],
  },
});
