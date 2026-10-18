/**
 * @xui-design/icons - 图标包
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
  | 'arrow-left'
  | 'arrow-right'
  | 'calendar'
  | 'user'
  | 'inbox'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'clock';

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
  'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7" />',
  'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7" />',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />',
  inbox:
    '<path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />',
  info: '<circle cx="12" cy="12" r="9" /><path d="M12 8h.01" /><path d="M12 11v5" />',
  success: '<circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.4 2.4 4.6-5.2" />',
  warning:
    '<path d="M10.3 4.1L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 4.1a2 2 0 00-3.4 0z" /><path d="M12 9v4" /><path d="M12 16.5h.01" />',
  error: '<circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" />',
  clock: '<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />',
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
    throw new Error(`@xui-design/icons: 未知图标 "${name}"，可用图标：${ICON_NAMES.join(', ')}`);
  }
  return `<svg ${svgAttrs(options)}>${markup}</svg>`;
}

/** 渲染为 DOM SVGSVGElement（仅浏览器环境；SSR 请使用 getIconSvg） */
export function createIconElement(name: IconName, options?: IconOptions): SVGSVGElement {
  if (typeof document === 'undefined') {
    throw new Error('@xui-design/icons: createIconElement 仅支持浏览器环境，SSR 请使用 getIconSvg');
  }
  const template = document.createElement('template');
  template.innerHTML = getIconSvg(name, options);
  return template.content.firstElementChild as SVGSVGElement;
}
