/**
 * e2e 视觉回归：代表页整页截图对比
 *
 * 基线在 e2e/__screenshots__/（提交入库）；样式/布局有意变更后运行
 * `pnpm e2e visual -- --update-snapshots` 重新生成并一并提交。
 * 选取静态内容为主的页面（避开 mock 上传等随机进度 demo）。
 */

import { expect, test } from '@playwright/test';

const VISUAL_PAGES = [
  { path: '/', name: 'home' },
  { path: '/components/button/', name: 'button' },
  { path: '/components/steps/', name: 'steps' },
] as const;

test.describe('视觉回归', () => {
  for (const { path, name } of VISUAL_PAGES) {
    test(`${name} 页面截图对比`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // 等待过渡动画与字体稳定
      await page.waitForTimeout(800);
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
