/**
 * e2e 冒烟：全量组件文档页遍历
 *
 * 每页断言：HTTP 200、H1 渲染、无 Vite 错误遮罩、无未捕获 console error。
 * 组件清单直接复用 component-list.ts（纯数据模块），与 docs:gen 同一来源。
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { expect, test } from '@playwright/test';

// 从 component-list.ts 源码提取 slug（避免转译链路上的非数据依赖）
const componentListSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../apps/docs/src/content/component-list.ts'),
  'utf-8',
);

const slugs = [...componentListSource.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);

test.describe('组件文档页冒烟', () => {
  test('组件清单非空（与 component-list.ts 同源）', () => {
    expect(slugs.length).toBeGreaterThanOrEqual(33);
  });

  for (const slug of slugs) {
    test(`页面 /components/${slug}/ 正常渲染`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(String(error)));

      const response = await page.goto(`/components/${slug}/`);
      expect(response?.status(), testInfo.title).toBe(200);

      // H1 渲染（VitePress 内容区）
      await expect(page.locator('main h1')).toBeVisible();

      // 无 Vite 错误遮罩（编译错误时出现）
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);

      // 等待 demo 挂载完成后再断言无页面级未捕获错误
      await page.waitForLoadState('networkidle');
      expect(errors, `页面 ${slug} 出现未捕获错误: ${errors.join('; ')}`).toEqual([]);
    });
  }
});
