# @xui-design/icons

跨框架组件库(Vue 3 + React 19)的**框架无关 SVG 图标数据源**包——以原始 SVG 标记数据 + 渲染工具函数形式提供,Vue / React 双端共用同一套数据源,颜色跟随文本色。

## 职责边界

- ✅ 提供:图标名 → 内层 SVG 标记的映射(`icons`)、完整 `<svg>` 字符串渲染(`getIconSvg`)、DOM 元素渲染(`createIconElement`)
- ✅ 保证:统一 SVG 壳约定(`viewBox` / `fill` / `stroke` 等),双端视觉一致、可由各框架适配层自由内联渲染
- ❌ 不提供:Vue / React 组件封装(由 `@xui-design/vue` / `@xui-design/react` 各自的 Icon 适配层基于本包数据实现)
- ❌ 不提供:打包后的雪碧图 / 字体图标 / 图标字体 CSS

## 依赖关系

- 运行时依赖:`@xui-design/styles`(workspace,组件渲染时复用 `.xui-button__spinner` 等类名,如 loading 图标)
- 构建配置:`vite` + `vite-plugin-dts`,外部化 `@xui-design/styles`(`rollupOptions.external`)
- 测试:`vitest`

## 模块 / 文件结构

```
packages/icons/
├── package.json
├── vite.config.ts          # 入口 src/index.ts，preserveModules 保留模块结构
├── vitest.config.ts
├── tsconfig.json
└── src/
    ├── index.ts            # 全部导出：icons / IconName / getIconSvg / createIconElement / ...
    └── __tests__/
        └── icons.test.ts   # vitest 单测：数据合法性 / 渲染契约 / 未知图标错误
```

源码全部集中在 `src/index.ts` 单文件,无按图标的分文件拆分。

## 导出 / 子路径

`package.json` 的 `exports` 字段:

| 子路径 | 解析目标 | 说明 |
| --- | --- | --- |
| `.` | `dist/index.mjs` / `dist/index.cjs`(+ `dist/types/index.d.ts`) | **核心数据与渲染 API**(唯一导出,无子路径) |

## 完整图标清单

共 **18 个**图标(`IconName` 类型联合 + `icons` 映射的键),按 `src/index.ts` 中声明顺序:

| 图标名 | 用途 | 内层 SVG 标记 |
| --- | --- | --- |
| `close` | 关闭 / × | `<path d="M6 6l12 12M18 6L6 18" />` |
| `clear` | 清除(带圆框) | `<circle cx="12" cy="12" r="10" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />` |
| `loading` | 加载中(虚线圆) | `<circle cx="12" cy="12" r="9" stroke-width="2.5" stroke-dasharray="40 60" />` |
| `check` | 勾选 | `<path d="M4 12l5 5L20 7" />` |
| `search` | 搜索 | `<circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />` |
| `plus` | 加号 | `<path d="M12 5v14M5 12h14" />` |
| `minus` | 减号 | `<path d="M5 12h14" />` |
| `arrow-up` | 上箭头 | `<path d="M12 19V5M5 12l7-7 7 7" />` |
| `arrow-down` | 下箭头 | `<path d="M12 5v14M19 12l-7 7-7-7" />` |
| `arrow-left` | 左箭头 | `<path d="M19 12H5M12 19l-7-7 7-7" />` |
| `arrow-right` | 右箭头 | `<path d="M5 12h14M12 5l7 7-7 7" />` |
| `calendar` | 日历 | `<rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />` |
| `user` | 用户 | `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />` |
| `inbox` | 收件箱 | `<path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />` |
| `info` | 信息 | `<circle cx="12" cy="12" r="9" /><path d="M12 8h.01" /><path d="M12 11v5" />` |
| `success` | 成功(带圆框) | `<circle cx="12" cy="12" r="9" /><path d="M8.5 12.2l2.4 2.4 4.6-5.2" />` |
| `warning` | 警告(三角) | `<path d="M10.3 4.1L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 4.1a2 2 0 00-3.4 0z" /><path d="M12 9v4" /><path d="M12 16.5h.01" />` |
| `error` | 错误(带圆框 ×) | `<circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" />` |

## SVG 数据格式与壳约定

### 数据格式

`icons` 是 `Record<IconName, string>`,**值仅为内层 SVG 标记,不含 `<svg>` 壳**:

```ts
export const icons: Record<IconName, string> = {
  close: '<path d="M6 6l12 12M18 6L6 18" />',
  // ...
};
```

这样设计便于各框架适配层把标记直接拼进自己的 `<svg>` 元素(Vue 模板 `v-html` / React 的 `dangerouslySetInnerHTML` 或 JSX 内联),壳属性由框架侧或本包的渲染函数统一注入。

### SVG 壳约定(由 `svgAttrs` 统一生成)

所有渲染输出(`getIconSvg` / `createIconElement`)的 `<svg>` 壳使用统一属性:

```
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"          ← 颜色跟随文本色(color: ...)
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
width="{size}" height="{size}" ← 默认 16px
class="{className}"            ← 可选
```

颜色策略:`stroke="currentColor"`,图标颜色随父元素 `color` 属性继承,无需为每个图标配置颜色。

## 完整导出 API

### `ICONS_VERSION: string`

包版本号常量,当前值 `'0.0.0'`。

```ts
export const ICONS_VERSION = '0.0.0';
```

### `IconName`(类型)

图标名联合类型(见上表 18 个值)。

```ts
export type IconName =
  | 'close' | 'clear' | 'loading' | 'check' | 'search'
  | 'plus' | 'minus'
  | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right'
  | 'calendar' | 'user' | 'inbox'
  | 'info' | 'success' | 'warning' | 'error';
```

### `icons: Record<IconName, string>`

图标名 → 内层 SVG 标记的映射。值为不含 `<svg>` 壳的纯标记,可直接拼入自定义 `<svg>` 壳。

### `ICON_NAMES: IconName[]`

全部图标名数组,`Object.keys(icons)` 派生,用于遍历 / 校验。

```ts
export const ICON_NAMES = Object.keys(icons) as IconName[];
```

### `IconOptions`(接口)

渲染选项。

```ts
export interface IconOptions {
  /** 尺寸(px)，默认 16 */
  size?: number;
  /** 附加 class */
  className?: string;
}
```

### `getIconSvg(name: IconName, options?: IconOptions): string`

渲染为完整 `<svg>` 字符串(SSR / 文档场景可用)。未知图标抛出带可用图标列表的 `Error`。

```ts
export function getIconSvg(name: IconName, options?: IconOptions): string;
```

### `createIconElement(name: IconName, options?: IconOptions): SVGSVGElement`

渲染为 DOM `SVGSVGElement`(仅浏览器环境)。SSR 环境(`document` 未定义)抛错并提示改用 `getIconSvg`。内部通过 `<template>` 解析 `getIconSvg` 输出。

```ts
export function createIconElement(name: IconName, options?: IconOptions): SVGSVGElement;
```

## 使用示例

### 1. 在 Vue 适配层内联渲染

```vue
<script setup lang="ts">
import { icons, type IconName } from '@xui-design/icons';
defineProps<{ name: IconName }>();
</script>

<template>
  <svg
    viewBox="0 0 24 24" width="16" height="16"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"
    v-html="icons[name]"
  />
</template>
```

### 2. 在 React 适配层内联渲染

```tsx
import { icons, type IconName } from '@xui-design/icons';

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
}
```

### 3. SSR / 文档场景(直接拿 `<svg>` 字符串)

```ts
import { getIconSvg } from '@xui-design/icons';

const html = getIconSvg('check', { size: 24, className: 'my-check' });
// → <svg viewBox="0 0 24 24" width="24" height="24" ... class="my-check"><path d="M4 12l5 5L20 7" /></svg>
```

### 4. 浏览器直接拿 DOM 元素

```ts
import { createIconElement } from '@xui-design/icons';

const el = createIconElement('loading', { size: 14, className: 'xui-button__spinner' });
document.body.appendChild(el); // el 为 SVGSVGElement,可直接插入 DOM
```

### 5. 颜色跟随文本色

```css
.xui-message__item--error .xui-message__icon {
  color: var(--xui-color-danger, #dc2626); /* 图标 stroke=currentColor 会取这个色 */
}
```

## 关键约定

1. **单一数据源**:图标统一由 `@xui-design/icons` 提供,双端共用同一套 SVG 数据,避免 Vue / React 各自维护图标导致漂移。
2. **数据不含 `<svg>` 壳**:`icons` 值仅为内层标记,壳属性由渲染函数 / 框架适配层统一注入,保证壳约定一致。
3. **颜色策略**:`stroke="currentColor"`,图标颜色随父元素 `color` 继承,主题切换时无需为图标单独配色。
4. **viewBox 统一**:`0 0 24 24`,所有图标在同一 24×24 画布设计。
5. **未知图标必须抛错**:`getIconSvg` 对未知 `name` 抛出带可用图标列表的可读 `Error`,而非静默返回空。
6. **SSR 安全**:`createIconElement` 检测 `document`,SSR 环境直接抛错并指向 `getIconSvg`,避免在 Node 侧误用 DOM API。
