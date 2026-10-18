/**
 * e2e 关键交互冒烟：覆盖双端 demo tab 的核心交互路径
 *
 * 文档站每个 demo 区块带 Vue / React tab，默认 Vue；点 React tab 后验证同交互。
 * 选择器基于组件 BEM 类名（与双端样式单一来源一致）。
 */

import { expect, test } from '@playwright/test';

test.describe('Select', () => {
  test('单选：展开面板 → 选中选项 → 触发器回显', async ({ page }) => {
    await page.goto('/components/select/');
    const block = page.locator('.xui-select').first();
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await block.locator('.xui-select__trigger').click();
    await expect(block.locator('.xui-select__dropdown')).toBeVisible();

    const option = block.locator('.xui-select__option').first();
    const optionText = (await option.textContent()) ?? '';
    await option.click();

    await expect(block.locator('.xui-select__dropdown')).toBeHidden();
    await expect(block.locator('.xui-select__value')).toHaveText(optionText);
  });
});

test.describe('TreeSelect', () => {
  test('多选：展开面板 → 勾选复选框 → 标签出现', async ({ page }) => {
    await page.goto('/components/tree-select/');
    // 第二个 demo 区块为多选模式（首个为单选）
    const block = page.locator('.xui-tree-select').nth(1);
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await block.locator('.xui-tree-select__trigger').click();
    const checkbox = block.locator('.xui-tree-select__checkbox').first();
    await checkbox.click();

    await expect(block.locator('.xui-tree-select__tag').first()).toBeVisible();
    // 多选面板保持展开
    await expect(block.locator('.xui-tree-select__panel')).toBeVisible();
  });
});

test.describe('Steps', () => {
  test('点击步骤 → 当前高亮迁移', async ({ page }) => {
    await page.goto('/components/steps/');
    const steps = page.locator('.xui-steps').first();
    await steps.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const items = steps.locator('.xui-steps__item');
    await items.nth(2).click();
    await expect(items.nth(2)).toHaveClass(/is-current/);
    await expect(items.nth(0)).toHaveClass(/is-finish/);
  });
});

test.describe('Dropdown', () => {
  test('hover 触发 → 菜单展开 → 点击菜单项收起', async ({ page }) => {
    await page.goto('/components/dropdown/');
    const dropdown = page.locator('.xui-dropdown').first();
    await dropdown.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await dropdown.locator('.xui-dropdown__trigger').hover();
    await expect(dropdown.locator('.xui-dropdown__menu')).toBeVisible({ timeout: 2000 });

    await dropdown.locator('.xui-dropdown__item').first().click();
    await expect(dropdown.locator('.xui-dropdown__menu')).toBeHidden();
  });
});

test.describe('Upload', () => {
  test('drag 形态：dropzone 渲染且拖入悬停高亮', async ({ page }) => {
    await page.goto('/components/upload/');
    const dropzone = page.locator('.xui-upload__drag').first();
    await dropzone.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(dropzone).toBeVisible();
    // 派发 dragenter（DataTransfer 在 evaluate 内构造）
    await dropzone.evaluate((el) => {
      const dt = new DataTransfer();
      el.dispatchEvent(
        new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }),
      );
    });
    await expect(dropzone).toHaveClass(/is-dragover/);
  });
});

test.describe('双端 demo 切换', () => {
  test('TreeSelect React demo 同样可展开面板', async ({ page }) => {
    await page.goto('/components/tree-select/');
    const reactTabs = page.getByRole('tab', { name: 'React' });
    await reactTabs.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await reactTabs.first().click();
    await page.waitForTimeout(500);

    const block = page.locator('.xui-tree-select').first();
    await block.scrollIntoViewIfNeeded();
    await block.locator('.xui-tree-select__trigger').click();
    await expect(block.locator('.xui-tree-select__panel')).toBeVisible();
  });
});
