import { describe, expect, it } from 'vitest';
import { ICON_NAMES, ICONS_VERSION, createIconElement, getIconSvg, icons } from '../index';
import type { IconName } from '../index';

describe('icons 数据', () => {
  it('ICONS_VERSION 有值', () => {
    expect(ICONS_VERSION).toBeTruthy();
  });

  it('每个图标的内层标记均为合法的非空 SVG 片段', () => {
    for (const name of ICON_NAMES) {
      const markup = icons[name];
      expect(markup, `图标 ${name} 不应为空`).toBeTruthy();
      expect(markup).toMatch(/<[a-z]/i);
      expect(markup).not.toContain('<svg');
    }
  });

  it('ICON_NAMES 与 icons 键一致', () => {
    expect(ICON_NAMES.sort()).toEqual(Object.keys(icons).sort());
  });
});

describe('getIconSvg', () => {
  it('生成统一 SVG 壳约定', () => {
    const svg = getIconSvg('close');
    expect(svg).toContain('<svg ');
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('fill="none"');
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).toContain(icons.close);
  });

  it('默认尺寸 16，可自定义尺寸与 class', () => {
    expect(getIconSvg('check')).toContain('width="16" height="16"');
    expect(getIconSvg('check', { size: 24 })).toContain('width="24" height="24"');
    expect(getIconSvg('check', { className: 'my-icon' })).toContain('class="my-icon"');
  });

  it('未知图标抛出可读错误', () => {
    expect(() => getIconSvg('nope' as IconName)).toThrowError(/未知图标 "nope"/);
  });
});

describe('createIconElement', () => {
  it('返回 SVGSVGElement 并携带统一壳属性', () => {
    const el = createIconElement('close', { size: 14 });
    expect(el.tagName.toLowerCase()).toBe('svg');
    expect(el.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(el.getAttribute('width')).toBe('14');
    expect(el.getAttribute('stroke')).toBe('currentColor');
    expect(el.childElementCount).toBeGreaterThan(0);
  });

  it('附加 class 生效', () => {
    const el = createIconElement('close', { className: 'xui-button__spinner' });
    expect(el.classList.contains('xui-button__spinner')).toBe(true);
  });
});
