/// <reference types="vite/client" />
/// <reference types="vitepress/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.md' {
  // VitePress markdown 组件（md 作为页面由 VP 编译，此声明仅供 TS 容错）
  const component: unknown;
  export default component;
}
