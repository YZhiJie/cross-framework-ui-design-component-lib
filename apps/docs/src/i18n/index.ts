/**
 * 文档站国际化（轻量自研，与 @xui-design/shared locale 同一模式）
 *
 * - 模块级 reactive locale：组件渲染中读取 t() 即自动收集依赖，切语言全站响应式更新
 * - 与组件库 locale 联动：切换文档语言时同步 setLocale，demo 内置文案跟随
 * - VitePress 迁移后语言由路由驱动：LocaleSync 组件监听 useData().lang 写入本模块，
 *   SSR / 水化阶段即按当前 locale 渲染，无闪变
 *
 * 与组件库 locale（@xui-design/shared locale）的分工：
 * 组件库 locale 管组件内置文案（okText 等），本模块管文档站自身全部文案。
 */
import { reactive, readonly } from 'vue';
import { setLocale as setXuiLocale } from '@xui-design/vue';

/** 文档站支持的语言 */
export type DocsLocale = 'zh-CN' | 'en-US';

/** 双语文本：meta / 页面内容字段，渲染时按当前语言取值 */
export interface LText {
  'zh-CN': string;
  'en-US': string;
}

const state = reactive<{ locale: DocsLocale }>({ locale: 'zh-CN' });

/** 当前文档语言（响应式只读） */
export const docsLocale = readonly(state);

/** 按当前语言取双语文本（在组件渲染上下文中调用即响应式） */
export const t = (text: LText): string => text[state.locale];

/** 判断当前是否为中文（模板条件渲染用） */
export const isZh = (): boolean => state.locale === 'zh-CN';

// ---------- 框架无关订阅（供 React demo 通过 useSyncExternalStore 跨框架订阅） ----------

type LocaleListener = (locale: DocsLocale) => void;

const listeners = new Set<LocaleListener>();

/** 订阅文档语言变化（返回取消订阅函数） */
export const subscribeDocsLocale = (listener: LocaleListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** 获取当前语言快照（useSyncExternalStore 的 getSnapshot 参数） */
export const getDocsLocaleSnapshot = (): DocsLocale => state.locale;

/** 应用语言副作用：通知订阅者 + 组件库 locale 联动（SSR 下仅更新状态） */
const applyLocale = (locale: DocsLocale): void => {
  state.locale = locale;
  listeners.forEach((listener) => listener(locale));
  if (typeof document === 'undefined') return;
  // <html lang> 与页面标题由 VitePress 按路由 locale 管理，这里只联动组件库文案
  document.documentElement.lang = locale;
  setXuiLocale(locale);
};

/** 切换文档语言（LocaleSync 在挂载与路由 locale 变化时调用） */
export const setDocsLocale = (locale: DocsLocale): void => {
  if (locale === state.locale) return;
  applyLocale(locale);
};

/** 初始化当前语言（LocaleSync 挂载时调用一次，SSR 与客户端水化均执行，保证渲染一致） */
export const initDocsLocale = (locale: DocsLocale): void => {
  state.locale = locale;
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  setXuiLocale(locale);
};
