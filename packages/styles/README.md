# @xui-design/styles

跨框架组件库(Vue 3 + React 19)的**共享样式单一来源**包——基础重置 + 主题 tokens(含暗色)+ 全部组件 BEM 样式,由 `@xui-design/vue` 与 `@xui-design/react` 共同引用,确保双端视觉一致、不漂移。

## 职责边界

- ✅ 提供:全局 CSS 变量 tokens(浅色/暗色)、基础重置、所有组件的 BEM 类名样式
- ✅ 保证:双端(Vue / React)共用**同一套类名**,避免各自维护样式导致视觉漂移
- ❌ 不提供:组件逻辑、JS 运行时、框架适配层(在 `@xui-design/vue` / `@xui-design/react`)
- ❌ 不提供:主题切换的 JS API(由 `@xui-design/shared/theme` 通过写入 `<html data-theme="dark">` 完成)

## 依赖关系

- 运行时依赖:无
- 开发依赖:`sass ^1.70.0`(用于编译 `.scss`)
- 被依赖方:`@xui-design/icons`(workspace)、`@xui-design/vue`、`@xui-design/react` 等消费组件类名与 token

## 模块 / 文件结构

```
packages/styles/
├── package.json
├── vite.config.ts          # 构建：src/index.ts → dist/index.mjs/cjs + dist/index.css（插件回写 CSS 引用）
├── tsconfig.json
└── src/
    ├── index.ts            # JS 入口：副作用引入 index.scss
    ├── index.scss          # 样式入口：@use reset + tokens + components
    ├── reset.scss          # 基础重置（box-sizing / margin / padding 清零）
    ├── tokens.scss         # 主题 tokens：:root（浅色默认）+ [data-theme='dark']（暗色覆盖）
    └── components.scss     # 全部组件 BEM 样式（25 个组件块）
```

`src/index.scss` 通过 `@use` 依次聚合三个分块:

```scss
@use './reset.scss';
@use './tokens.scss';
@use './components.scss';
```

## 导出 / 子路径

`package.json` 的 `exports` 字段:

| 子路径 | 解析目标 | 说明 |
| --- | --- | --- |
| `.` | `dist/index.mjs` / `dist/index.cjs` | **推荐消费方式**:JS 产物内注入了对 `index.css` 的引用,`import '@xui-design/styles'` 即生效全部样式 |
| `./index.css` | `dist/index.css` | 仅需要 CSS 文件时的直接引用方式 |

> 说明:所有样式(reset / tokens / components)统一打包输出为单文件 `dist/index.css`,不提供按 reset / theme / components 拆分的子路径导出。

`sideEffects` 标记 `**/*.css` 与 `**/*.scss` 为有副作用,避免打包器误删样式。

## tokens.scss 的 CSS 变量清单

### 1. 语义色 token(`:root` 浅色默认值)

| 分类 | 变量名 | 浅色默认值 |
| --- | --- | --- |
| 品牌色 | `--xui-color-primary` | `#4f46e5` |
| | `--xui-color-primary-hover` | `#4338ca` |
| | `--xui-color-primary-active` | `#3730a3` |
| 文本色 | `--xui-color-text` | `#1f2937` |
| | `--xui-color-text-secondary` | `#6b7280` |
| 边框与背景 | `--xui-color-border` | `#d1d5db` |
| | `--xui-color-bg` | `#fff` |
| | `--xui-color-bg-disabled` | `#f3f4f6` |
| | `--xui-color-bg-hover` | `#f9fafb` |
| | `--xui-color-bg-container` | `#fff` |
| 状态色 | `--xui-color-success` | `#16a34a` |
| | `--xui-color-warning` | `#d97706` |
| | `--xui-color-danger` | `#dc2626` |
| | `--xui-color-info` | `#2563eb` |
| 遮罩与阴影 | `--xui-color-overlay` | `rgb(0 0 0 / 50%)` |
| | `--xui-shadow-sm` | `0 1px 2px rgb(0 0 0 / 6%)` |
| | `--xui-shadow-md` | `0 4px 12px rgb(0 0 0 / 10%)` |
| | `--xui-shadow-lg` | `0 8px 24px rgb(0 0 0 / 16%)` |
| 深色气泡(Tooltip) | `--xui-color-tooltip-bg` | `#1f2937` |
| | `--xui-color-tooltip-text` | `#fff` |
| 轨道 / 分隔线 | `--xui-color-track` | `#e5e7eb` |
| | `--xui-color-divider` | `#e5e7eb` |

并设置 `color-scheme: light`。

### 2. 结构 token(不随主题切换)

| 分类 | 变量名 | 值 |
| --- | --- | --- |
| 圆角 | `--xui-radius-sm` / `--xui-radius-md` / `--xui-radius-lg` | `4px` / `6px` / `8px` |
| 字号 | `--xui-font-size-sm` / `--xui-font-size-md` / `--xui-font-size-lg` | `12px` / `14px` / `16px` |
| 间距 | `--xui-spacing-xs` / `--xui-spacing-sm` / `--xui-spacing-md` / `--xui-spacing-lg` | `4px` / `8px` / `12px` / `16px` |

### 3. 暗色主题(`[data-theme='dark']`)

仅覆盖**语义色变量**,结构 token(圆角 / 字号 / 间距)**保持不变**;并设置 `color-scheme: dark`。覆盖的变量:

- 品牌色:`--xui-color-primary`(`#818cf8`)、`--xui-color-primary-hover`(`#a5b4fc`)、`--xui-color-primary-active`(`#6366f1`)
- 文本色:`--xui-color-text`(`#f3f4f6`)、`--xui-color-text-secondary`(`#9ca3af`)
- 边框与背景:`--xui-color-border`(`#374151`)、`--xui-color-bg`(`#111827`)、`--xui-color-bg-disabled`(`#1f2937`)、`--xui-color-bg-hover`(`#1f2937`)、`--xui-color-bg-container`(`#111827`)
- 状态色:`--xui-color-success`(`#4ade80`)、`--xui-color-warning`(`#fbbf24`)、`--xui-color-danger`(`#f87171`)、`--xui-color-info`(`#60a5fa`)
- 遮罩与阴影:`--xui-color-overlay`(`rgb(0 0 0 / 65%)`)、`--xui-shadow-sm` / `--xui-shadow-md` / `--xui-shadow-lg`(透明度加重)
- 深色气泡(Tooltip):`--xui-color-tooltip-bg`(`#374151`)、`--xui-color-tooltip-text`(`#f3f4f6`)
- 轨道 / 分隔线:`--xui-color-track`(`#374151`)、`--xui-color-divider`(`#374151`)

### 4. 组件级扩展 token(在 `components.scss` 中引用,未在 `tokens.scss :root` 定义,依赖降级值)

这些 token 不在全局 `:root` 中定义,组件样式通过 `var(--xui-xxx, fallback)` 形式引用,可由消费方在实例级 `style` 透传覆盖:

| 变量名 | 引用位置 | 降级值 |
| --- | --- | --- |
| `--xui-color-text-placeholder` | `.xui-date-picker__day.is-outside`、`.xui-table__sort-icons` | `#9ca3af` / `#c0c4cc` |
| `--xui-color-text-disabled` | `.xui-breadcrumb__item.is-disabled .xui-breadcrumb__label`、`.xui-breadcrumb__separator`、`.xui-input-number__input::placeholder`、`.xui-input-number__btn:disabled` | `#9ca3af` |
| `--xui-color-border-light` | `.xui-table__td`、`.xui-table.is-bordered` 表格线 | `#f3f4f6` |
| `--xui-color-bg-selected` | `.xui-table tbody tr.is-selected .xui-table__td` | `#eef2ff` |
| `--xui-select-item-height` | `.xui-select__option` 高度 | `30px` |
| `--xui-table-row-height` | `.xui-table.is-virtual .xui-table__td` 高度 | `40px` |

> `tokens.scss` 注释中以 `--xui-button-height` 为例说明组件实例级覆盖(如 `style="--xui-button-height: 40px"`),该名称为示例,实际未在 `components.scss` 中引用。

## BEM 命名规范

- 块(block):`.xui-{name}`,如 `.xui-button`、`.xui-modal`、`.xui-date-picker`
- 元素(element):`.xui-{block}__{element}`,如 `.xui-modal__header`、`.xui-date-picker__trigger`
- 修饰符(modifier):`.xui-{block}--{modifier}`,如 `.xui-button--primary`、`.xui-button--sm`、`.xui-switch--has-text`
- 状态类:`.is-{state}`,与块/元素组合使用,如 `.is-disabled`、`.is-checked`、`.is-active`、`.is-open`、`.is-loading`、`.is-striped`、`.is-bordered`、`.is-virtual`、`.is-selected`、`.is-clickable`、`.is-even`、`.is-outside`、`.is-today`、`.is-focused`、`.is-readonly`、`.is-block`、`.is-dot`、`.is-drop-up`、`.is-multiple`、`.is-blur`、`.is-last`、`.is-indeterminate`、`.is-success`、`.is-error` 等

`components.scss` 当前覆盖的 25 个组件块:Button、Input、RadioGroup、Radio、Progress、Badge、Avatar、Empty、Select、Tabs、Message、Tooltip、Pagination、DatePicker、Table、Spin、Breadcrumb、Skeleton、InputNumber、Popconfirm、Modal、Switch、Checkbox、Tag、Alert。

## 暗色主题机制

- 暗色变量由 `tokens.scss` 的 `[data-theme='dark']` 选择器提供,**仅覆盖语义色**,结构 token 不变
- 运行时切换统一走 `@xui-design/shared/theme` 模块(`setTheme` / `getTheme` / `toggleTheme`),由其向 `<html>` 写入 `data-theme="dark"` 属性触发
- 组件样式不感知主题,只消费 `var(--xui-color-*)`,主题切换时自动重算

### 主题自定义三层配置

1. **全局预设主题**:`setTheme('dark' | 'light')` 切换 `<html data-theme>`
2. **全局 token 覆盖**:`setThemeTokens(...)` / `clearThemeTokens()` 在 `:root` 层临时覆盖变量(优先级高于预设主题)
3. **组件级 style 透传**:在组件实例上通过 `style="--xui-xxx-xxx: ..."` 单独覆盖(优先级最高,作用域限于该实例)

## 使用示例

### 1. 全量引入(推荐)

```ts
// 应用入口(任意框架通用)
import '@xui-design/styles';
```

JS 产物(`dist/index.mjs` / `dist/index.cjs`)内已注入对 `dist/index.css` 的引用,裸导入即生效全部样式;也兼容显式引用 `import '@xui-design/styles/index.css'`。

一行即获得 reset + 浅色/暗色 tokens + 全部组件样式。

### 2. 切换暗色主题

```ts
import { setTheme, toggleTheme } from '@xui-design/shared/theme';

setTheme('dark');   // <html data-theme="dark"> → tokens.scss 暗色块生效
toggleTheme();       // dark ⇄ light 切换
```

### 3. 全局 token 覆盖(临时改品牌色)

```ts
import { setThemeTokens, clearThemeTokens } from '@xui-design/shared/theme';

setThemeTokens({ '--xui-color-primary': '#2563eb' });
// 用完恢复
clearThemeTokens();
```

### 4. 组件实例级覆盖

```html
<!-- 通过 style 透传 CSS 变量,只影响该实例 -->
<button class="xui-button xui-button--primary" style="--xui-color-primary: #16a34a">
  自定义品牌色按钮
</button>

<!-- 覆盖 Select 选项行高 -->
<div class="xui-select" style="--xui-select-item-height: 36px">...</div>

<!-- 虚拟滚动 Table 行高 -->
<div class="xui-table is-virtual" style="--xui-table-row-height: 48px">...</div>
```

## 关键约定

1. **单一来源**:组件样式统一由 `@xui-design/styles` 输出,双端共用同一套类名,禁止 Vue / React 各自维护组件样式导致漂移。
2. **语义 token 优先**:组件新增变体或状态时必须消费语义 token(`var(--xui-color-*)`),禁止硬编码色值(已有的少量硬编码如 Tag/Alert 的浅色背景为历史遗留)。
3. **降级值兜底**:所有 `var(--xui-*, fallback)` 均带降级值,未引入 tokens 时组件仍可独立可用。
4. **stylelint:no-descending-specificity**——同前缀下高特异性选择器必须排在低特异性规则之后:
   - `:hover` 态选择器必须放在同前缀 `is-disabled` / `is-active` / `:disabled` / `:first-child` / `:last-child` 等派生规则**之后**
   - 斑马纹(`.is-striped` + `nth-child`)特异性高于 `.is-bordered` 派生规则,需排在后面
5. **stylelint:selector-not-notation**——多排除类使用 `:not(.a, .b)` 逗号复合形式(见 `.xui-select__option:hover:not(.is-disabled, .is-active)`、`.xui-tabs__tab:hover:not(.is-active, .is-disabled)`)。
6. **stylelint:media-feature-range-notation**——媒体查询使用新记法 `@media (width <= 900px)`(本包当前未使用 `@media`,但为全局统一规则)。
7. **同特异性覆盖顺序不被 stylelint 拦截**:尺寸修饰符(`--sm` 等)的同属性覆盖规则一律放在通用态规则**之后**(如 `.xui-switch--sm.is-checked .xui-switch__thumb` 必须在 `.xui-switch.is-checked .xui-switch__thumb` 之后,否则 sm 开关会误用 md 的 20px 位移溢出轨道)。
8. **⚠️ Switch 文本截断坑**:`.xui-switch__text` 在 `inline-flex` 容器中 `text-overflow: ellipsis` 不生效(文本为匿名 flex item),必须改为 `display: block` + `transform: translateY(-50%)` 实现垂直居中(见 `components.scss` 中 `.xui-switch__text` 实现)。
