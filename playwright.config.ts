/**
 * Playwright 配置：文档站 e2e 冒烟 + 视觉回归
 *
 * webServer 复用 VitePress dev server（按需编译，首轮访问较慢，已放宽超时）；
 * 视觉基线在 e2e/__screenshots__/（入库），更新用 `pnpm e2e -- --update-snapshots`。
 */

import { defineConfig } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  // dev server 首轮按需编译慢 + 视觉回归串行更稳
  workers: 1,
  timeout: 30_000,
  retries: 2,
  fullyParallel: false,
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1280, height: 720 },
    navigationTimeout: 20_000,
  },
  expect: {
    toHaveScreenshot: {
      // 首次基线不齐全时直接生成而非报错
      maxDiffPixelRatio: 0.02,
    },
  },
  webServer: {
    command: `pnpm --filter @xui-design/docs dev:e2e`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  reporter: [['list']],
});
