/**
 * React demo 挂载桥
 *
 * 文档站主体是 Vue 应用，React 端 demo 通过 createRoot 命令式挂载到独立容器。
 * 每个 DemoBlock 持有自己的 Root，切换 tab / 卸载时调用 root.unmount()。
 */
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ComponentType } from 'react';

export function mountReactDemo(container: HTMLElement, demo: ComponentType): Root {
  const root = createRoot(container);
  root.render(createElement(demo));
  return root;
}
