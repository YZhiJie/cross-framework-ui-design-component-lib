# 主题定制 <span class="page-head__en">Theming</span> <span class="doc-tag">指南</span>

基于 CSS 变量的三层主题体系：全局明暗主题切换、全站品牌 token 定制、单组件作用域覆盖，双端（@xui-design/vue / @xui-design/react）共享同一套运行时 API。

## 工作机制

- **明暗主题**：组件样式仅消费语义 token（`--xui-color-*`），暗色主题由 `[data-theme='dark']` 选择器整体覆盖语义色，切换主题即切换 `<html>` 上的属性。
- **全局 token**：`setThemeTokens` 把 CSS 变量写入 `<html>` 内联样式，级联覆盖预设 token，全站即时生效、无需刷新。
- **组件级定制**：在组件根元素 `style` 上直接写 CSS 变量（双端 style 透传均支持自定义属性），级联仅作用于该子树。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 全局明暗主题切换

setTheme 写入 &lt;html data-theme&gt;，全部组件的语义色联动切换；toggleTheme 在 light / dark 间往返。

<GuideDemo guide="theme" demo-id="dark" />

### 全局品牌色 token（setThemeTokens）

setThemeTokens 将 CSS 变量写入 &lt;html&gt;，全站所有组件生效；clearThemeTokens 仅清除本 API 写入的 token。

<GuideDemo guide="theme" demo-id="tokens" />

### 组件级主题定制

无需任何 API：在组件 style 上直接写 CSS 变量，级联仅作用于该子树，优先级高于全局 token。

<GuideDemo guide="theme" demo-id="scoped" />

## API

主题 API 由 `@xui-design/shared` 提供（框架无关实现），`@xui-design/vue` 与 `@xui-design/react` 同名导出，行为完全一致。

### 命令式方法

<GuideApi guide="theme" kind="methods" />

### 契约类型

**XuiTheme**

```ts
type XuiTheme = 'light' | 'dark';
```

主题名（light 为默认，dark 由 tokens.scss 的 [data-theme=dark] 提供）。

**ThemeTokens**

```ts
type ThemeTokens = Record<string, string>;
```

主题 token 集合：键为 CSS 自定义属性名（-- 开头），值为对应 CSS 值。
