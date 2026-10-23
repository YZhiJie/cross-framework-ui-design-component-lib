/**
 * React 端 demo 跨框架订阅文档语言
 *
 * 文档站主体是 Vue 应用，React demo 经 createRoot 命令式挂载。
 * Vue 的 reactive 系统不会触发 React 重渲染，因此通过 useSyncExternalStore
 * 订阅 i18n 模块的 listener，语言切换时 React demo 自动重渲染。
 */
import { useSyncExternalStore } from 'react';
import { subscribeDocsLocale, getDocsLocaleSnapshot, type DocsLocale } from './index';

/** React demo 中获取当前文档语言（语言切换时自动重渲染） */
const useDocsLocale = (): DocsLocale =>
  useSyncExternalStore(subscribeDocsLocale, getDocsLocaleSnapshot, getDocsLocaleSnapshot);

/** React demo 中判断是否为中文 */
export const useIsZh = (): boolean => useDocsLocale() === 'zh-CN';
