/**
 * 主题运行时 API（框架无关）
 *
 * 与 @xui-design/styles 的 tokens.scss 联动：切换主题 = 写入 <html data-theme="dark">，
 * 浅色为默认（移除属性）。SSR 环境下安全降级（无 DOM 不写入，getTheme 返回 light）。
 * 状态通知基于内存 listener 集合，供双端订阅主题变化。
 */

/** 主题名（light 为默认；dark 由 tokens.scss 的 [data-theme='dark'] 提供） */
export type XuiTheme = 'light' | 'dark';

/** 主题变化监听器 */
export type ThemeListener = (theme: XuiTheme) => void;

/** 写入 <html> 的属性名（与 tokens.scss 的选择器 [data-theme='dark'] 对齐） */
export const THEME_ATTRIBUTE = 'data-theme';

const listeners = new Set<ThemeListener>();

const isBrowser = (): boolean => typeof document !== 'undefined';

/** 读取当前主题（无 DOM / 未设置时返回 light） */
export function getTheme(): XuiTheme {
  if (!isBrowser()) return 'light';
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark' ? 'dark' : 'light';
}

/** 切换主题：写入 <html data-theme> 并通知订阅者（值未变化时静默返回） */
export function setTheme(theme: XuiTheme): void {
  if (!isBrowser()) return;

  const root = document.documentElement;
  const unchanged =
    theme === 'dark'
      ? root.getAttribute(THEME_ATTRIBUTE) === 'dark'
      : !root.hasAttribute(THEME_ATTRIBUTE);
  if (unchanged) return;

  if (theme === 'dark') {
    root.setAttribute(THEME_ATTRIBUTE, 'dark');
  } else {
    root.removeAttribute(THEME_ATTRIBUTE);
  }

  const snapshot = theme;
  listeners.forEach((listener) => listener(snapshot));
}

/** 在 light / dark 间切换，返回切换后的主题（SSR 无 DOM 时保持 light 不切换） */
export function toggleTheme(): XuiTheme {
  if (!isBrowser()) return 'light';
  const next: XuiTheme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/** 订阅主题变化（由 setTheme / toggleTheme 触发），返回取消订阅函数 */
export function subscribeTheme(listener: ThemeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 主题 token 集合：键为 CSS 自定义属性名（-- 开头），值为对应 CSS 值 */
export type ThemeTokens = Record<string, string>;

/** 已写入 <html> style 的 token 名（供 clearThemeTokens 精确清除） */
const appliedTokenNames = new Set<string>();

/**
 * 写入全局主题 token（CSS 自定义变量，作用于 <html>，全站生效）。
 * 仅接受 -- 开头的变量名与非空字符串值，非法条目静默忽略；
 * 重复调用按合并语义追加/覆盖，不清除未提及的既有 token。
 * 组件级定制无需此 API：在组件根元素 style 上直接写 CSS 变量即可（级联仅作用于该子树）。
 */
export function setThemeTokens(tokens: ThemeTokens): void {
  if (!isBrowser()) return;
  const root = document.documentElement;
  Object.entries(tokens).forEach(([name, value]) => {
    if (!name.startsWith('--') || typeof value !== 'string') return;
    root.style.setProperty(name, value);
    appliedTokenNames.add(name);
  });
}

/** 清除全部通过 setThemeTokens 写入的全局 token（不影响 data-theme 与应用自身变量） */
export function clearThemeTokens(): void {
  if (!isBrowser()) return;
  const root = document.documentElement;
  appliedTokenNames.forEach((name) => {
    root.style.removeProperty(name);
  });
  appliedTokenNames.clear();
}
