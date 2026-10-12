# @xui/shared/theme

主题定制运行时核心（框架无关），为 Vue 3 / React 19 双端组件库提供统一的浅色 / 深色主题切换、全局 token 覆盖与订阅能力。

## 职责边界

- **纯逻辑 + 最小 DOM 写入**：仅在 `setTheme` / `setThemeTokens` 时写入 `<html>` 的 `data-theme` 属性或 `style` CSS 变量，不渲染组件、不读布局。
- **框架无关**：不引入 Vue / React，状态通知基于内存 `Set<ThemeListener>`，供任意适配层桥接。
- **SSR 安全降级**：所有 DOM 写入前判定 `typeof document !== 'undefined'` / `typeof window`；无 DOM 时 `getTheme` 返回 `'light'`、写入 API 直接 return，不抛错。
- **与样式层契约联动**：`data-theme` 属性名与 `@xui/styles` 的 `tokens.scss` 选择器 `[data-theme='dark']` 对齐；浅色为默认（移除属性）。

## 导出 API 清单（index.ts）

| 导出 | 签名 | 说明 |
| --- | --- | --- |
| `THEME_ATTRIBUTE` | `const THEME_ATTRIBUTE = 'data-theme'` | 写入 `<html>` 的属性名，与 tokens.scss 选择器对齐（注：仅 theme.ts 内部常量，index.ts 不再导出） |
| `getTheme` | `function getTheme(): XuiTheme` | 读取当前主题（无 DOM / 未设置时返回 `'light'`） |
| `setTheme` | `function setTheme(theme: XuiTheme): void` | 切换主题：写入 `<html data-theme>` 并通知订阅者（值未变化时静默返回） |
| `toggleTheme` | `function toggleTheme(): XuiTheme` | 在 light / dark 间切换，返回切换后的主题（SSR 无 DOM 时保持 light 不切换） |
| `setThemeTokens` | `function setThemeTokens(tokens: ThemeTokens): void` | 写入全局主题 token（CSS 自定义变量，作用于 `<html>`，全站生效） |
| `clearThemeTokens` | `function clearThemeTokens(): void` | 清除全部通过 `setThemeTokens` 写入的全局 token |
| `subscribeTheme` | `function subscribeTheme(listener: ThemeListener): () => void` | 订阅主题变化（由 `setTheme` / `toggleTheme` 触发），返回取消订阅函数 |
| `XuiTheme` | `type` | 主题名联合类型 `'light' | 'dark'` |
| `ThemeTokens` | `type` | 主题 token 集合（键为 CSS 自定义属性名，值为 CSS 值） |
| `ThemeListener` | `type` | 主题变化监听器 |

> 注：`THEME_ATTRIBUTE` 为 theme.ts 内部常量，未在 index.ts 中导出；外部约定通过 `'light' | 'dark'` 与样式层选择器对齐，无需直接读取属性名。

## 关键类型定义

### `XuiTheme`

```ts
export type XuiTheme = 'light' | 'dark';
```

`'light'` 为默认；`'dark'` 由 `tokens.scss` 的 `[data-theme='dark']` 提供。

### `ThemeTokens`

```ts
export type ThemeTokens = Record<string, string>;
```

键为 CSS 自定义属性名（须 `--` 开头），值为对应 CSS 值。非法条目（键不以 `--` 开头、值非字符串）在 `setThemeTokens` 中静默忽略。

### `ThemeListener`

```ts
export type ThemeListener = (theme: XuiTheme) => void;
```

收到切换后的主题名。

## 工作机制

### setTheme：预设主题切换

- 写入 `<html>` 的 `data-theme` 属性：`theme === 'dark'` 时 `setAttribute('data-theme', 'dark')`，`'light'` 时 `removeAttribute('data-theme')`（浅色即"无属性"）。
- **静默返回条件**：值未变化时直接返回——`'dark'` 下若 `data-theme` 已是 `'dark'` 则不重写、不通知；`'light'` 下若 `<html>` 无 `data-theme` 属性则不操作、不通知。避免重复通知造成的多余渲染。
- 写入后遍历 `listeners` 通知所有订阅者，传入切换后的主题名。

### getTheme

- 无 DOM 时返回 `'light'`；有 DOM 时读 `<html>` 的 `data-theme`，等于 `'dark'` 返回 `'dark'`，否则（含未设置、值为其他）返回 `'light'`。

### toggleTheme

- 无 DOM 时直接返回 `'light'`，不切换；有 DOM 时读 `getTheme()` 计算 `next` 反向主题，调用 `setTheme(next)`，返回 `next`。
- `setTheme` 内部已处理"值未变化静默返回"，因此 `toggleTheme` 在 SSR 下不会触发副作用。

### setThemeTokens：全局 token 覆盖

- 遍历 `tokens` 条目，**仅接受键以 `--` 开头且值为字符串的条目**，其余静默忽略。
- 命中条目调用 `root.style.setProperty(name, value)` 写入 `<html>` 的 inline style，并把变量名加入模块级 `appliedTokenNames` 集合。
- 重复调用按**合并语义**追加 / 覆盖，不清除未提及的既有 token——要整体回收须显式调用 `clearThemeTokens`。
- SSR 无 DOM 时直接 return，不写入。

### clearThemeTokens：精确回收

- 仅清除通过 `setThemeTokens` 写入的、登记在 `appliedTokenNames` 中的变量名，调用 `root.style.removeProperty(name)`。
- 不影响 `data-theme` 属性、不影响应用自身通过其他路径写入 `<html>` style 的 CSS 变量。
- 回收后清空 `appliedTokenNames` 集合，避免重复清除。

### subscribeTheme

- 基于 `Set<ThemeListener>`，返回取消订阅函数；仅 `setTheme` / `toggleTheme` 会触发，`setThemeTokens` / `clearThemeTokens` 不触发（token 变化由 CSS 变量级联即时生效，无需运行时通知）。

## 三层配置机制

组件库的主题定制按以下三层叠加生效，越靠后优先级越高：

1. **全局预设主题**：`setTheme('light' | 'dark')` 切换 `<html data-theme>`，由 `tokens.scss` 提供 light / dark 两套语义 token 的取值映射。这是最粗粒度的整体换肤。
2. **全局 token 覆盖**：`setThemeTokens({ '--xui-color-primary': '#ff6600' })` 在 `<html>` inline style 上覆盖单个 CSS 变量，全站生效、跨组件级联；`clearThemeTokens` 精确回收，不影响其他变量与 `data-theme`。
3. **组件级 style 透传**：在组件根元素 `style` 上直接写 CSS 变量（如 `style="--xui-color-primary: #0066ff"`），级联仅作用于当前组件子树。组件级定制**无需调用** `setThemeTokens`，也不应写入 `<html>`。

## SSR 安全降级

- `isBrowser()` 内联判定 `typeof document !== 'undefined'`，所有写入 API（`setTheme` / `setThemeTokens` / `clearThemeTokens`）在 SSR 下直接 return，不抛错、不写入。
- `getTheme` 在无 DOM 时返回 `'light'`，保证 SSR 首屏渲染与客户端首次渲染快照一致。
- `toggleTheme` 在无 DOM 时直接返回 `'light'`，不调用 `setTheme`，避免 SSR 阶段触发订阅者通知。

## 使用示例

```ts
import {
  clearThemeTokens,
  getTheme,
  setTheme,
  setThemeTokens,
  subscribeTheme,
  toggleTheme,
} from '@xui/shared/theme';

// 1) 切换到深色
setTheme('dark'); // <html data-theme="dark">
getTheme(); // 'dark'

// 2) 在 light / dark 间切换
toggleTheme(); // 返回 'light'，<html> 移除 data-theme

// 3) 全局覆盖语义 token（全站级联）
setThemeTokens({
  '--xui-color-primary': '#ff6600',
  '--xui-radius-md': '8px',
  '--invalid': 123 as unknown as string, // 静默忽略（值非字符串）
});
// <html style="--xui-color-primary: #ff6600; --xui-radius-md: 8px;">

// 4) 精确回收全部全局 token（不影响 data-theme）
clearThemeTokens();

// 5) 订阅主题变化
const unsubscribe = subscribeTheme((theme) => {
  console.log('theme changed to', theme);
});
unsubscribe();
```

## 双端接入方式

适配层把 `subscribeTheme` + `getTheme` 桥接到各框架的响应式系统：

- **Vue 3（`useTheme` / `useLogicState` 等价模式）**：在 Composable 内部调用 `subscribeTheme`，收到主题变化后通过 `ref<XuiTheme>` 触发模板重渲染；返回响应式引用，模板可直接 `theme === 'dark'` 分支渲染。
- **React 19（`useTheme`）**：使用 `useSyncExternalStore(subscribeTheme, getTheme, () => 'light')`。`getTheme` 在 SSR / 客户端首次均返回稳定字符串，配合 `useSyncExternalStore` 的 hydration 快照语义避免 mismatch。返回的主题字符串可直接在 JSX 中消费。

> ⚠️ React 适配层必须使用 `useSyncExternalStore` + 快照缓存模式，否则主题切换会触发无限重渲染。

## 关键避坑点

1. **`setTheme` 的静默返回**：值未变化时不会通知订阅者——若适配层依赖通知触发首次渲染，应在初始化时主动调用 `getTheme()` 取一次快照，不要依赖"订阅即收到当前值"。
2. **`setThemeTokens` 的合并语义**：多次调用追加 / 覆盖、不清除未提及变量；要整体回收须显式 `clearThemeTokens`，不要靠"传空对象"清除。
3. **非法输入静默忽略**：`setThemeTokens` 对不以 `--` 开头的键、非字符串值静默忽略；`setTheme` 接受的是 `'light' | 'dark'` 联合类型，传其他字符串不会写入但也不会抛错（TS 层会拦截）。
4. **组件级定制不要走 `setThemeTokens`**：组件级定制应在组件根元素 `style` 上直接写 CSS 变量，级联仅作用于当前子树；走 `setThemeTokens` 会污染全站。
5. **样式变体必须消费语义 token**：组件样式新增变体时必须消费 `var(--xui-color-*)` 等语义 token，而非硬编码色值——否则 `setTheme` / `setThemeTokens` 无法影响该变体。
6. **`data-theme` 属性名对齐**：`THEME_ATTRIBUTE = 'data-theme'` 与 `tokens.scss` 选择器强耦合；若样式层重命名选择器，必须同步更新本模块常量。
7. **`toggleTheme` 的 SSR 行为**：SSR 下 `toggleTheme` 不切换、直接返回 `'light'`；客户端水合后首次调用才会真正切换，不要在 SSR 阶段依赖 `toggleTheme` 的副作用。
