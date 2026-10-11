import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearThemeTokens,
  getTheme,
  setTheme,
  setThemeTokens,
  subscribeTheme,
  toggleTheme,
} from '../theme';

/** 最小 <html> document 桩：记录 data-theme 属性变更与 style 内联变量 */
function stubDocument() {
  const attrs = new Map<string, string>();
  const styleVars = new Map<string, string>();
  const root = {
    getAttribute: (name: string) => attrs.get(name) ?? null,
    setAttribute: (name: string, value: string) => {
      attrs.set(name, value);
    },
    removeAttribute: (name: string) => {
      attrs.delete(name);
    },
    hasAttribute: (name: string) => attrs.has(name),
    style: {
      setProperty: (name: string, value: string) => {
        styleVars.set(name, value);
      },
      removeProperty: (name: string) => {
        styleVars.delete(name);
      },
    },
  };
  vi.stubGlobal('document', { documentElement: root });
  return { attrs, styleVars };
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

  describe('setThemeTokens / clearThemeTokens', () => {
    it('写入 -- 开头的合法变量到 html style', () => {
      const { styleVars } = stubDocument();
      setThemeTokens({ '--xui-color-primary': '#e11d48', '--xui-radius-md': '8px' });
      expect(styleVars.get('--xui-color-primary')).toBe('#e11d48');
      expect(styleVars.get('--xui-radius-md')).toBe('8px');
    });

    it('非法条目静默忽略（非 -- 前缀 / 非字符串值）', () => {
      const { styleVars } = stubDocument();
      setThemeTokens({
        color: '#000',
        '--ok': '#fff',
        '--bad': 123 as unknown as string,
      });
      expect(styleVars.has('color')).toBe(false);
      expect(styleVars.get('--ok')).toBe('#fff');
      expect(styleVars.has('--bad')).toBe(false);
    });

    it('重复调用按合并语义覆盖，不清除未提及 token', () => {
      const { styleVars } = stubDocument();
      setThemeTokens({ '--a': '1', '--b': '2' });
      setThemeTokens({ '--a': '3' });
      expect(styleVars.get('--a')).toBe('3');
      expect(styleVars.get('--b')).toBe('2');
    });

    it('clearThemeTokens 精确清除已写入 token，不影响其他变量', () => {
      const { styleVars } = stubDocument();
      setThemeTokens({ '--a': '1', '--b': '2' });
      // 模拟应用自身变量（非 setThemeTokens 写入）
      styleVars.set('--app-own', 'x');
      clearThemeTokens();
      expect(styleVars.has('--a')).toBe(false);
      expect(styleVars.has('--b')).toBe(false);
      expect(styleVars.get('--app-own')).toBe('x');
      // 清除后可重新写入
      setThemeTokens({ '--a': '9' });
      expect(styleVars.get('--a')).toBe('9');
    });

    it('SSR 无 DOM 时安全降级不抛错', () => {
      vi.stubGlobal('document', undefined);
      expect(() => setThemeTokens({ '--a': '1' })).not.toThrow();
      expect(() => clearThemeTokens()).not.toThrow();
    });
  });
});
