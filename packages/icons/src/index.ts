/**
 * @xui/icons - 图标包
 *
 * 框架无关的 SVG 图标基础设施：
 * - icons：图标名 → 内层 SVG 标记（不含 <svg> 壳），供各框架适配层内联渲染
 * - getIconSvg：渲染为完整 <svg> 字符串（SSR / 文档场景）
 * - createIconElement：渲染为 DOM SVGSVGElement（浏览器直接使用）
 *
 * SVG 壳约定：viewBox="0 0 24 24"、fill="none"、stroke="currentColor"、
 * stroke-width="2"、stroke-linecap/linejoin="round"，颜色跟随文本色。
 */

export const ICONS_VERSION = '0.0.0';

/** 图标名 */
export type IconName =
  | 'close'
  | 'clear'
  | 'loading'
  | 'check'
  | 'search'
  | 'plus'
  | 'minus'
  | 'arrow-up'
  | 'arrow-down'
  | 'calendar';

/** 图标内层 SVG 标记（不含 <svg> 壳） */
export const icons: Record<IconName, string> = {
  close: '<path d="M6 6l12 12M18 6L6 18" />',
  clear: '<circle cx="12" cy="12" r="10" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />',
  loading: '<circle cx="12" cy="12" r="9" stroke-width="2.5" stroke-dasharray="40 60" />',
  check: '<path d="M4 12l5 5L20 7" />',
  search: '<circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />',
  plus: '<path d="M12 5v14M5 12h14" />',
  minus: '<path d="M5 12h14" />',
  'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7" />',
  'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7" />',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />',
};

/** 全部图标名 */
export const ICON_NAMES = Object.keys(icons) as IconName[];

/** 渲染选项 */
export interface IconOptions {
  /** 尺寸（px），默认 16 */
  size?: number;
  /** 附加 class */
  className?: string;
}

/** 生成 <svg> 属性串（内部共用） */
function svgAttrs({ size = 16, className }: IconOptions = {}): string {
  const cls = className ? ` class="${className}"` : '';
  return `viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}`;
}

/** 渲染为完整 <svg> 字符串（SSR / 文档场景可用） */
export function getIconSvg(name: IconName, options?: IconOptions): string {
  const markup = icons[name];
  if (markup === undefined) {
    throw new Error(`@xui/icons: 未知图标 "${name}"，可用图标：${ICON_NAMES.join(', ')}`);
  }
  return `<svg ${svgAttrs(options)}>${markup}</svg>`;
}

/** 渲染为 DOM SVGSVGElement（仅浏览器环境；SSR 请使用 getIconSvg） */
export function createIconElement(name: IconName, options?: IconOptions): SVGSVGElement {
  if (typeof document === 'undefined') {
    throw new Error('@xui/icons: createIconElement 仅支持浏览器环境，SSR 请使用 getIconSvg');
  }
  const template = document.createElement('template');
  template.innerHTML = getIconSvg(name, options);
  return template.content.firstElementChild as SVGSVGElement;
}
