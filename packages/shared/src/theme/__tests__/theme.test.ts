import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTheme, setTheme, subscribeTheme, toggleTheme } from '../theme';

/** 最小 <html> document 桩：记录 data-theme 属性变更 */
function stubDocument() {
  const attrs = new Map<string, string>();
  const root = {
    getAttribute: (name: string) => attrs.get(name) ?? null,
    setAttribute: (name: string, value: string) => {
      attrs.set(name, value);
    },
    removeAttribute: (name: string) => {
      attrs.delete(name);
    },
    hasAttribute: (name: string) => attrs.has(name),
  };
  vi.stubGlobal('document', { documentElement: root });
  return attrs;
}

beforeEach(() => {
  stubDocument();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('theme 运行时 API', () => {
  it('setTheme(dark) 写入 html data-theme 并通知订阅者', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);

    setTheme('dark');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('dark');
    unsubscribe();
  });

  it('setTheme(light) 移除 data-theme（浅色为默认）', () => {
    setTheme('dark');
    setTheme('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('主题未变化时静默返回（不重复通知）', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);

    setTheme('light');
    setTheme('dark');
    setTheme('dark');

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('toggleTheme 在 light/dark 间切换并返回新主题', () => {
    expect(getTheme()).toBe('light');
    expect(toggleTheme()).toBe('dark');
    expect(getTheme()).toBe('dark');
    expect(toggleTheme()).toBe('light');
    expect(getTheme()).toBe('light');
  });

  it('退订后不再收到通知', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);
    unsubscribe();

    setTheme('dark');
    expect(listener).not.toHaveBeenCalled();
  });

  it('多个订阅者均收到通知', () => {
    const first = vi.fn();
    const second = vi.fn();
    const unsubFirst = subscribeTheme(first);
    const unsubSecond = subscribeTheme(second);

    setTheme('dark');
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    unsubFirst();
    unsubSecond();
  });
});

describe('theme SSR 降级（无 document）', () => {
  it('getTheme 返回 light，setTheme 不抛错', () => {
    // beforeEach 已恢复 node 环境的真实缺省：本用例不 stub document
    vi.unstubAllGlobals();

    expect(getTheme()).toBe('light');
    expect(() => setTheme('dark')).not.toThrow();
    expect(toggleTheme()).toBe('light');
  });
});
