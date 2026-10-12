/**
 * 文档站国际化（轻量自研，与 @xui-design/shared locale 同一模式）
 *
 * - 模块级 reactive locale：组件渲染中读取 t() 即自动收集依赖，切语言全站响应式更新
 * - 与组件库 locale 联动：切换文档语言时同步 setLocale，demo 内置文案跟随
 * - localStorage 持久化，刷新后保持；同时维护 <html lang>
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

const STORAGE_KEY = 'xui-docs-locale';

const state = reactive<{ locale: DocsLocale }>({ locale: 'zh-CN' });

/** 当前文档语言（响应式只读） */
export const docsLocale = readonly(state);

/** 按当前语言取双语文本（在组件渲染上下文中调用即响应式） */
export const t = (text: LText): string => text[state.locale];

/** 判断当前是否为中文（模板条件渲染用） */
export const isZh = (): boolean => state.locale === 'zh-CN';

/** 应用语言副作用：持久化 + <html lang> + 页面标题 + 组件库 locale 联动 */
const applyLocale = (locale: DocsLocale): void => {
  state.locale = locale;
  document.documentElement.lang = locale;
  document.title = locale === 'zh-CN' ? 'XUI - 跨框架组件库文档' : 'XUI - Cross-Framework UI Docs';
  localStorage.setItem(STORAGE_KEY, locale);
  // 组件库 demo 内置文案（Modal 按钮、Table 空态等）跟随文档语言
  setXuiLocale(locale);
};

/** 切换文档语言 */
export const setDocsLocale = (locale: DocsLocale): void => {
  if (locale === state.locale) return;
  applyLocale(locale);
};

/** 初始化：读取 localStorage 持久化语言（入口调用一次） */
export const initDocsLocale = (): void => {
  const saved = localStorage.getItem(STORAGE_KEY);
  applyLocale(saved === 'en-US' ? 'en-US' : 'zh-CN');
};
