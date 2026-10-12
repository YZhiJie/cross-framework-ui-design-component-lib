# @xui/shared

> 跨框架组件库的**纯逻辑核心层**：框架无关的组件逻辑工厂 + 主题 / 国际化 / 浮层定位 / 虚拟滚动 / 插件系统 / DOM 辅助等基础设施，不依赖任何框架运行时，双端（Vue 3 / React 19）共用同一份逻辑。

- 包名：`@xui/shared`
- 版本：`0.1.0`
- 入口：`dist/index.mjs`（ESM）/ `dist/index.cjs`（CJS）/ `dist/types/index.d.ts`（类型）
- 子路径导出：`./components/*`、`./hooks`、`./utils`
- `sideEffects: false`，可安全被 tree-shaking。

## 职责边界

### 这个包做什么

- 提供 **组件逻辑工厂**（`createXxxLogic`）：以闭包 + `subscribe` 模式实现 25 个组件的状态机，返回 `LogicInstance`（含 `subscribe` / `getState` / `updateOptions` + 组件特有交互方法），双端适配层仅做 DOM 桥接。
- 提供 **主题运行时 API**（`getTheme` / `setTheme` / `toggleTheme` / `subscribeTheme` / `setThemeTokens` / `clearThemeTokens`）：写入 `<html data-theme="dark">` 并通知订阅者，SSR 安全降级。
- 提供 **国际化运行时 API**（`getLocale` / `setLocale` / `registerLocale` / `subscribeLocale` / `getLocaleData`）：模块级语言包注册表，`getLocaleData()` 恒返回稳定引用（满足 `useSyncExternalStore` 语义），内置 `zhCN` / `enUS`。
- 提供 **浮层视口避让纯逻辑**（`resolveFloatingPosition` / `getViewport` / `bindViewportUpdate`）：Tooltip / Popconfirm / Select 共用，输入视口坐标矩形输出方位翻转 + 交叉轴钳制。
- 提供 **虚拟滚动原语**（`createVirtualListLogic`）：固定行高窗口计算，供 Table / Select 长列表复用，不触碰 DOM。
- 提供 **插件系统**（`applyPlugins` / `XuiPlugin`）：逻辑实例级别的标准扩展点与生命周期钩子，组件核心代码零改动接入。
- 提供 **DOM 辅助**（`trapFocus`）：Modal 等浮层的 Tab 焦点循环约束。
- 本地定义并导出逻辑层共用类型（`SelectOption` / `TabItem` / `MessageType` / `BreadcrumbItem` / `TableRow` / `TableSort` 等），供 `@xui/core` 复用对齐。

### 这个包不做什么

- **不依赖任何框架运行时**（不 import Vue / React），零框架依赖。
- **不允许 import `@xui/core`**：逻辑层类型在 shared 本地定义并导出，core 复用 / 对齐，依赖方向为 `core → shared`。
- **不触碰 DOM 渲染**：逻辑工厂仅维护状态快照与交互方法，DOM 事件绑定、元素创建由适配层桥接（仅 `trapFocus` / `bindViewportUpdate` / 主题 / 语言包等基础设施直接操作 DOM 属性）。
- **不声明组件 Props 契约**：Props / Events / Slots 契约由 `@xui/core` 定义，shared 仅提供 `XxxLogicOptions`（配置注入）与 `XxxState`（状态快照）。

## 依赖关系

### 它依赖哪些 @xui/* 包

- **运行时无 @xui/* 依赖**：`package.json` 的 `dependencies` 为空，源码不 import 任何 `@xui/*` 包。
- `@xui/utils`（`workspace:*`）仅声明为 **devDependency**，源码未引用（构建期 / 类型校验辅助，不进入运行时）。

### 被哪些包依赖

- `@xui/core`：spec 的 `useLogic` 调用 shared 的 `createXxxLogic` / `createMessageManager`，并从 shared 重导出 `messageDefaults`（命令式 API 默认值单一来源）。
- `@xui/vue` / `@xui/react`：适配层按 core 契约桥接，内部调用 shared 的逻辑工厂创建状态、订阅快照、调用交互方法；直接使用 shared 的主题 / 国际化 / 浮层定位 / 虚拟滚动 / 插件 / 焦点陷阱等基础设施。

## 模块结构

```
packages/shared/src/
├── index.ts          # 顶层导出：SHARED_VERSION/isXuiShared + 重导出 types 与各子模块
├── types.ts          # 通用类型原语（Unsubscribe/StateListener/Subscribe/LogicInstance）
├── theme/            # 主题运行时 API（写 <html data-theme> + token + 订阅）
│   ├── index.ts
│   └── theme.ts
├── locale/           # 国际化运行时 API（语言包注册表 + 订阅）
│   ├── index.ts
│   ├── locale.ts     # XuiLocaleData 类型 + getLocale/setLocale/registerLocale/...
│   ├── zh-CN.ts      # 中文（简体）语言包（默认）
│   └── en-US.ts      # 英文语言包
├── floating/         # 浮层视口避让纯逻辑（Tooltip/Popconfirm/Select 共用）
│   ├── index.ts
│   ├── resolve-floating-position.ts  # resolveFloatingPosition/getViewport
│   └── viewport-listener.ts         # bindViewportUpdate（scroll/resize 合并）
├── virtual-list/     # 虚拟滚动原语（固定行高窗口计算）
│   ├── index.ts
│   └── create-virtual-list-logic.ts
├── plugin/           # 插件系统（逻辑实例生命周期钩子）
│   ├── index.ts
│   ├── types.ts      # XuiPlugin / PluginInstallContext
│   └── apply-plugins.ts
├── utils/
│   └── focus-trap.ts # trapFocus（Tab 焦点循环，Modal 等浮层共用）
└── components/       # 25 个组件逻辑工厂（与 @xui/core 契约一一对应）
    └── <component>/
        ├── index.ts                # export * from './create-xxx-logic'
        ├── create-xxx-logic.ts      # createXxxLogic 工厂 + XxxLogicOptions/XxxState/XxxLogicInstance 类型
        └── __tests__/               # 纯逻辑单元测试（vitest）
```

## 完整导出 API 清单

> 以下签名与源码逐字一致。所有逻辑工厂统一遵循 `createXxxLogic(options?: XxxLogicOptions): XxxLogicInstance` 模式，返回值满足 `LogicInstance<P, S>`（来自 `src/types.ts`）+ 组件特有交互方法。

### 顶层常量与函数

```ts
export const SHARED_VERSION = '0.0.0';
```
shared 包版本标识常量。

```ts
export function isXuiShared(): true {
  return true;
}
```
运行时身份标记（恒返回 `true`），用于环境探测 / 调试。

### 通用类型原语（来自 `src/types.ts`）

```ts
export type Unsubscribe = () => void;
```
取消订阅函数。

```ts
export type StateListener<S> = (state: S) => void;
```
状态监听器，收到的是状态快照（浅拷贝）。

```ts
export type Subscribe<S> = (listener: StateListener<S>) => Unsubscribe;
```
订阅状态变更，返回取消订阅函数。

```ts
export interface LogicInstance<P extends Record<string, unknown>, S = unknown> {
  /** 订阅状态变更，返回取消订阅函数 */
  subscribe: Subscribe<S>;
  /** 获取当前状态快照（浅拷贝，外部修改不影响内部状态） */
  getState: () => S;
  /** 外部更新配置（Props 变更时由适配层调用） */
  updateOptions: (options: Partial<P>) => void;
}
```
逻辑实例通用形状（与 `@xui/core` 的 `LogicInstance` 结构兼容）。

### 主题运行时 API（来自 `src/theme/theme.ts`）

```ts
export type XuiTheme = 'light' | 'dark';
```
主题名（`light` 为默认；`dark` 由 `tokens.scss` 的 `[data-theme='dark']` 提供）。

```ts
export type ThemeListener = (theme: XuiTheme) => void;
```
主题变化监听器。

```ts
export const THEME_ATTRIBUTE = 'data-theme';
```
写入 `<html>` 的属性名（与 `tokens.scss` 的选择器 `[data-theme='dark']` 对齐）。

```ts
export function getTheme(): XuiTheme;
```
读取当前主题（无 DOM / 未设置时返回 `'light'`）。

```ts
export function setTheme(theme: XuiTheme): void;
```
切换主题：写入 `<html data-theme>` 并通知订阅者（值未变化时静默返回；SSR 无 DOM 时 no-op）。

```ts
export function toggleTheme(): XuiTheme;
```
在 `light` / `dark` 间切换，返回切换后的主题（SSR 无 DOM 时保持 `'light'` 不切换）。

```ts
export function subscribeTheme(listener: ThemeListener): () => void;
```
订阅主题变化（由 `setTheme` / `toggleTheme` 触发），返回取消订阅函数。

```ts
export type ThemeTokens = Record<string, string>;
```
主题 token 集合：键为 CSS 自定义属性名（`--` 开头），值为对应 CSS 值。

```ts
export function setThemeTokens(tokens: ThemeTokens): void;
```
写入全局主题 token（CSS 自定义变量，作用于 `<html>`，全站生效）；仅接受 `--` 开头的变量名与非空字符串值，非法条目静默忽略；重复调用按合并语义追加 / 覆盖。

```ts
export function clearThemeTokens(): void;
```
清除全部通过 `setThemeTokens` 写入的全局 token（不影响 `data-theme` 与应用自身变量）。

### 国际化运行时 API（来自 `src/locale/locale.ts` + 语言包）

```ts
export type XuiLocaleData = {
  /** Modal 弹窗按钮 */
  modal: { ok: string; cancel: string };
  /** Popconfirm 气泡按钮 */
  popconfirm: { confirm: string; cancel: string };
  /** Table 表格 */
  table: {
    /** 空数据回退文案（empty 插槽 / renderEmpty 未提供时） */
    empty: string;
    /** 行选择列全选复选框 aria-label */
    selectAll: string;
    /** 行选择复选框 aria-label（index 为 0 起始行号） */
    selectRow: (index: number) => string;
  };
  /** Pagination 分页 aria-label */
  pagination: { nav: string; prev: string; next: string };
  /** DatePicker 日期选择 */
  datePicker: {
    /** 面板 aria-label */
    panel: string;
    /** 上 / 下月按钮 aria-label */
    prevMonth: string;
    nextMonth: string;
    /** 面板标题格式化（年 / 月） */
    titleFormat: (year: number, month: number) => string;
    /** 星期表头（周日起始，7 项，整体替换不做逐项合并） */
    weekdays: readonly string[];
    /** 触发器 placeholder（value 为空时） */
    placeholder: string;
  };
  /** Skeleton 骨架屏 */
  skeleton: { loading: string };
  /** Breadcrumb 面包屑 */
  breadcrumb: { nav: string };
  /** Select 选择器 */
  select: {
    /** filterable 搜索输入框 placeholder */
    searchPlaceholder: string;
    /** 搜索输入框 aria-label */
    searchAriaLabel: string;
    /** 触发器 placeholder（value 为空时） */
    triggerPlaceholder: string;
  };
};
```
组件库语言包（按组件分组的用户可见文案）。

```ts
export type XuiLocaleInput = { [K in keyof XuiLocaleData]?: Partial<XuiLocaleData[K]> };
```
`registerLocale` 的输入：允许只提供部分组 / 部分字段，未提供字段回退基底语言包。

```ts
export type LocaleListener = (data: XuiLocaleData) => void;
```
语言包变更监听器（收到切换 / 重新注册后的完整语言包）。

```ts
export const DEFAULT_LOCALE = 'zh-CN';
```
默认语言标识（未调用 `setLocale` 时零行为变化）。

```ts
export function getLocale(): string;
```
读取当前语言标识。

```ts
export function getLocaleData(): XuiLocaleData;
```
读取当前生效语言包（稳定引用；内置包直接复用同一引用，仅语言切换 / 当前包重新注册时重建，满足 React `useSyncExternalStore` 快照语义）。

```ts
export function subscribeLocale(listener: LocaleListener): () => void;
```
订阅语言包变更，返回取消订阅函数。

```ts
export function setLocale(key: string): void;
```
切换语言：未注册的 key 静默忽略；与当前语言相同或语言包未变化时静默返回。

```ts
export function registerLocale(key: string, partial: XuiLocaleInput): void;
```
注册 / 覆盖语言包：以既有注册（新语言回退当前生效包）为基底做组级浅合并，未提供字段继承基底；注册当前生效语言时重建缓存并通知，否则仅更新注册表；非法入参（空 key / 非对象 partial / 非对象组）静默忽略。

```ts
export const zhCN: XuiLocaleData;
```
中文（简体）语言包（默认语言，文案与历史硬编码默认值逐字一致）。

```ts
export const enUS: XuiLocaleData;
```
英文（US）语言包。

### 浮层视口避让（来自 `src/floating/`）

```ts
export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';
```
四方位（与 core 契约的 `placement` 联合类型对齐）。

```ts
export type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};
```
视口坐标矩形（`Pick<DOMRect, ...>`，可直接传 `getBoundingClientRect()` 结果）。

```ts
export type FloatingViewport = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
```
视口边界（视口坐标；整页场景即 `0` / `innerWidth` / `innerHeight` / `0`）。

```ts
export type ResolveFloatingOptions = {
  /** 首选方位（由 placement prop 提供） */
  placement: FloatingPlacement;
  /** 触发器与浮层的间距（px，与 CSS 的 calc(100% + gap) 保持一致） */
  gap?: number;
  /** 浮层与视口边缘的最小安全距离（px） */
  viewportPadding?: number;
};
```
避让计算入参选项。

```ts
export type FloatingPosition = {
  /** 实际应采用的方位（可能已向对侧翻转） */
  placement: FloatingPlacement;
  /**
   * 交叉轴平移修正量（px）：
   * top / bottom 方位为水平位移（正向右移），left / right 方位为垂直位移（正向下移）；
   * 适配层将其叠加到浮层 margin / transform 上
   */
  shift: number;
};
```
避让计算结果。

```ts
export function resolveFloatingPosition(
  trigger: FloatingRect,
  popper: FloatingRect,
  viewport: FloatingViewport,
  options: ResolveFloatingOptions,
): FloatingPosition;
```
计算浮层相对视口的最终方位与交叉轴偏移（纯函数：相同输入必得相同输出，不读取 DOM，便于单测；首选方位放不下且对侧空间更充足时翻转，居中对齐后向视口安全区钳制）。

```ts
export function getViewport(): FloatingViewport;
```
获取当前视口边界（整页可视区域）；SSR / 无 `window` 环境下降级为零矩形（计算结果等价于不翻转不偏移）。

```ts
export function bindViewportUpdate(callback: () => void): () => void;
```
视口变化订阅（`scroll` 以 capture 方式监听 `window`，`resize` 监听 `window`；回调经 `requestAnimationFrame` 合并，一帧内最多执行一次）；SSR / 无 `window` 环境下返回空解绑函数。

### 虚拟滚动原语（来自 `src/virtual-list/create-virtual-list-logic.ts`）

```ts
export type VirtualListOptions = {
  /** 条目总数 */
  itemCount?: number;
  /** 单条高度（px，虚拟滚动要求行高固定） */
  itemHeight?: number;
  /** 视口高度（px，滚动容器的内容区高度） */
  viewportHeight?: number;
  /** 视口外上下各多渲染的缓冲条数 */
  overscan?: number;
};
```
VirtualList 逻辑配置（由适配层注入并随 Props 同步）。

```ts
export type VirtualListState = {
  /** 可视窗口起始条目下标（含缓冲） */
  startIndex: number;
  /** 可视窗口结束条目下标（含缓冲、含尾） */
  endIndex: number;
  /** 窗口前占位高度 = startIndex * itemHeight（适配层渲染 spacer / 偏移） */
  offsetY: number;
  /** 窗口后占位高度（适配层渲染尾部 spacer） */
  fillerHeight: number;
  /** 列表总高度 = itemCount * itemHeight */
  totalHeight: number;
  /** 当前滚动偏移（px） */
  scrollTop: number;
};
```
VirtualList 状态快照。

```ts
export interface VirtualListLogicInstance extends LogicInstance<
  VirtualListOptions,
  VirtualListState
> {
  /** 滚动容器滚动到指定偏移（px，越界自动 clamp） */
  scrollTo: (offset: number) => void;
  /** 滚动到指定条目（index 越界自动 clamp；align 默认 auto：目标已在窗口内则不动） */
  scrollToIndex: (index: number, align?: 'start' | 'end' | 'auto') => void;
}
```
VirtualList 逻辑实例。

```ts
export function createVirtualListLogic(options: VirtualListOptions = {}): VirtualListLogicInstance;
```
固定行高虚拟滚动的窗口计算核心（供 Table 行 / Select 选项等长列表场景复用）；不触碰任何 DOM，滚动事件由适配层桥接；默认 `overscan` 为 5。

### 插件系统（来自 `src/plugin/`）

```ts
export interface PluginInstallContext<
  P extends Record<string, unknown>,
  S = unknown,
  T extends LogicInstance<P, S> = LogicInstance<P, S>,
> {
  /** 原始逻辑实例（可读取状态 / 调用方法 / 订阅，不可替换） */
  logic: T;
  /** 向增强实例注入自定义方法（与既有方法同名时插件方法优先） */
  setMethod: (name: string, fn: (...args: never[]) => unknown) => void;
  /** 订阅状态变更（等价 logic.subscribe，语义化入口） */
  onStateChange: (listener: (state: S) => void) => Unsubscribe;
}
```
插件安装上下文（`install` 钩子入参）。

```ts
export interface XuiPlugin<
  P extends Record<string, unknown>,
  S = unknown,
  T extends LogicInstance<P, S> = LogicInstance<P, S>,
> {
  /** 插件名（同一实例安装时按名去重） */
  name: string;
  /** 安装钩子：逻辑实例创建后调用一次 */
  install?: (ctx: PluginInstallContext<P, S, T>) => void;
  /** 状态变更钩子：每次状态通知后调用（参数为最新快照） */
  onStateChange?: (state: S) => void;
  /** 配置更新前钩子：返回新对象可替换本次更新的配置（返回 undefined 表示不干预） */
  beforeUpdateOptions?: (options: Partial<P>) => Partial<P> | void;
  /** 配置更新后钩子：在核心逻辑应用配置完成后调用 */
  afterUpdateOptions?: (options: Partial<P>) => void;
  /** 销毁钩子：调用增强实例的 dispose 时触发（释放插件资源） */
  destroy?: () => void;
}
```
组件插件（生命周期顺序：`install` → `onStateChange` / `beforeUpdateOptions` / `afterUpdateOptions` → `destroy`）。

```ts
export function applyPlugins<P extends Record<string, unknown>, S, T extends LogicInstance<P, S>>(
  logic: T,
  plugins: ReadonlyArray<XuiPlugin<P, S, T>>,
): T & { dispose: () => void };
```
逻辑实例插件包装器：在不修改组件核心代码的前提下接入插件生命周期钩子；`onStateChange` 始终活跃（内部常驻订阅分发），`beforeUpdateOptions` 可拦截并替换每次 `updateOptions` 的入参，`install` 可注入自定义方法，`dispose` 触发插件 `destroy`；所有插件钩子经 `try/catch` 隔离（插件抛错不影响组件核心功能），同名插件按名去重（保留首个），零插件时直通原实例（仅附加空 `dispose`，零包装开销）。

### DOM 辅助（来自 `src/utils/focus-trap.ts`）

```ts
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
```
容器内可聚焦元素选择器（disabled 由过滤阶段排除，兼顾 attribute 与 property 禁用）。

```ts
export function trapFocus(event: KeyboardEvent, container: HTMLElement): boolean;
```
在容器内循环焦点（Tab 正序 / Shift+Tab 逆序）；焦点在最后一个可聚焦元素上按 Tab 回到第一个，在第一个元素上按 Shift+Tab 回到最后一个，焦点在容器外时收进容器内，容器内无可聚焦元素时焦点归还容器；仅当事件为 Tab 且实际接管焦点移动时 `preventDefault`，返回是否接管。

### 组件逻辑工厂（25 个）

每个组件目录的 `index.ts` 统一执行 `export * from './create-xxx-logic'`，导出 `createXxxLogic` 工厂 + `XxxLogicOptions` / `XxxState` / `XxxLogicInstance` 类型（部分组件额外导出辅助类型与纯函数）。下表列出各工厂签名与额外导出。

> 所有逻辑工厂的返回值统一满足 `LogicInstance<XxxLogicOptions, XxxState>`，并按需扩展交互方法；状态变更通过内部 `Set<StateListener>` 分发，`getState()` 返回浅拷贝快照；受控模式由 `options.value !== undefined` 判定（受控时仅回调、不更新内部状态）。

| # | 工厂函数 | 状态字段 | 交互方法 | 额外导出 |
|---|---------|---------|---------|---------|
| 1 | `createButtonLogic(options?: ButtonLogicOptions): ButtonLogicInstance` | `disabled` / `loading` | `handleClick` | — |
| 2 | `createInputLogic(options?: InputLogicOptions): InputLogicInstance` | `value` / `focused` / `disabled` / `readonly` | `handleInput` / `handleChange` / `handleFocus` / `handleBlur` / `handleClear` | — |
| 3 | `createSwitchLogic(options?: SwitchLogicOptions): SwitchLogicInstance` | `checked` / `disabled` / `loading` | `toggle` | — |
| 4 | `createCheckboxLogic(options?: CheckboxLogicOptions): CheckboxLogicInstance` | `checked` / `disabled` / `indeterminate` | `toggle` | — |
| 5 | `createTagLogic(options?: TagLogicOptions): TagLogicInstance` | `visible` / `closable` | `handleClose` | — |
| 6 | `createAlertLogic(options?: AlertLogicOptions): AlertLogicInstance` | `visible` / `closable` | `handleClose` | — |
| 7 | `createRadioGroupLogic(options?: RadioGroupLogicOptions): RadioGroupLogicInstance` | `value: string \| null` / `disabled` | `select` | — |
| 8 | `createRadioLogic(options?: RadioLogicOptions): RadioLogicInstance` | `disabled` | （无，选中态由组上下文派生） | — |
| 9 | `createProgressLogic(options?: ProgressLogicOptions): ProgressLogicInstance` | `percent` / `status` / `strokeWidth` | （纯展示，无交互） | `ProgressStatus` |
| 10 | `createBadgeLogic(options?: BadgeLogicOptions): BadgeLogicInstance` | `visible` / `text: string \| null` | （纯展示，无交互） | — |
| 11 | `createAvatarLogic(options?: AvatarLogicOptions): AvatarLogicInstance` | `failed` | `handleError` | — |
| 12 | `createEmptyLogic(options?: EmptyLogicOptions): EmptyLogicInstance` | `description: string \| null` | （纯展示，无交互） | — |
| 13 | `createSelectLogic(options?: SelectLogicOptions): SelectLogicInstance` | `value` / `open` / `activeIndex` / `disabled` / `searchQuery` / `filteredOptions` | `toggleOpen` / `close` / `select` / `clear` / `moveHighlight` / `confirmHighlight` / `setSearch` | `SelectOption` / `SelectValue` |
| 14 | `createTabsLogic(options?: TabsLogicOptions): TabsLogicInstance` | `value: string \| null` | `activate` / `moveActive` | `TabItem` |
| 15 | `createMessageManager(options?: MessageManagerOptions): MessageLogicInstance` | `items: MessageItem[]` | `open` / `close` / `closeAll` | `MessageType` / `MessageOptions` / `MessageItem` / `MessageHandle` / `messageDefaults` |
| 16 | `createTooltipLogic(options?: TooltipLogicOptions): TooltipLogicInstance` | `open` / `disabled` | `show` / `hide` | — |
| 17 | `createPaginationLogic(options?: PaginationLogicOptions): PaginationLogicInstance` | `page` / `pageCount` / `disabled` | `goTo` / `prev` / `next` | `PageItem` / `createPageItems` |
| 18 | `createDatePickerLogic(options?: DatePickerLogicOptions): DatePickerLogicInstance` | `value: string \| null` / `open` / `viewYear` / `viewMonth` / `disabled` | `toggleOpen` / `close` / `prevMonth` / `nextMonth` / `select` / `clear` | `DATE_WEEKDAY_LABELS` / `DateCell` / `formatDateParts` / `isValidDateString` / `parseDateString` / `todayString` / `getMonthMatrix` |
| 19 | `createTableLogic(options?: TableLogicOptions): TableLogicInstance` | `sortKey` / `sortOrder` / `sortedData` / `selectedRowKeys` / `allSelected` / `indeterminate` | `toggleSort` / `toggleRow` / `toggleAll` | `TableRow` / `TableRowKey` / `TableSortOrder` / `TableSort` / `TableRowSelection` / `formatTableCellValue` / `getRowKeyOf` |
| 20 | `createSpinLogic(options?: SpinLogicOptions): SpinLogicInstance` | `size` / `spinning` / `tip: string \| null` | （纯展示，无交互） | `SpinSize` |
| 21 | `createBreadcrumbLogic(options?: BreadcrumbLogicOptions): BreadcrumbLogicInstance` | `items` / `separator` | `selectItem` | `BreadcrumbItem` |
| 22 | `createSkeletonLogic(options?: SkeletonLogicOptions): SkeletonLogicInstance` | `loading` / `avatar` / `rows` | （纯展示，无交互） | — |
| 23 | `createInputNumberLogic(options?: InputNumberLogicOptions): InputNumberLogicInstance` | `value: number \| null` / `disabled` / `min` / `max` / `step` / `precision` | `stepValue` / `commitText` | — |
| 24 | `createPopconfirmLogic(options?: PopconfirmLogicOptions): PopconfirmLogicInstance` | `open` / `placement` / `disabled` | `toggle` / `confirm` / `cancel` / `close` | `PopconfirmPlacement` |
| 25 | `createModalLogic(options?: ModalLogicOptions): ModalLogicInstance` | `visible` / `closable` | `open` / `close` / `handleOk` / `handleCancel` / `handleMaskClick` / `handleEsc` | — |

#### 具有额外纯函数 / 类型导出的工厂补充签名

```ts
// pagination
export type PageItem = number | 'ellipsis-prev' | 'ellipsis-next';
/** 生成页码序列（总页数 <=7 全展示；否则固定首末页 + 当前页 ±1 + 省略号） */
export function createPageItems(page: number, pageCount: number): PageItem[];
```

```ts
// date-picker
export const DATE_WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as readonly string[];
export type DateCell = {
  /** 'YYYY-MM-DD' */
  date: string;
  /** 几号（1-31） */
  day: number;
  /** 是否属于当前视图月份 */
  inMonth: boolean;
  /** 是否今天 */
  isToday: boolean;
};
export function formatDateParts(year: number, month: number, day: number): string;
export function isValidDateString(value: unknown): value is string;
export function parseDateString(value: string): { year: number; month: number; day: number } | null;
export function todayString(): string;
/** 生成月矩阵（42 格：上月尾 + 本月 + 下月头；month 为 1-12） */
export function getMonthMatrix(year: number, month: number): DateCell[];
```

```ts
// table
export type TableRow = Record<string, unknown>;
export type TableRowKey = string | number;
export type TableSortOrder = 'asc' | 'desc' | null;
export type TableSort = { key: string; order: TableSortOrder };
export type TableRowSelection = {
  selectedRowKeys?: TableRowKey[];
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};
/** 单元格取值展示格式化：null/undefined 显示为空串 */
export function formatTableCellValue(value: unknown): string;
/** 行键提取：rowKey 字段值为 string/number 时返回，否则回退行下标 */
export function getRowKeyOf(record: TableRow, index: number, rowKey?: string): TableRowKey;
```

```ts
// message
export type MessageType = 'info' | 'success' | 'warning' | 'error';
export type MessageOptions = {
  type?: MessageType;
  content: string;
  duration?: number;
  closable?: boolean;
  icon?: string;
  key?: string | number;
  onClose?: () => void;
};
export type MessageItem = { id: number; type: MessageType; content: string; closable: boolean; icon?: string; key?: string | number; };
export type MessageHandle = { close: () => void };
export type MessageManagerOptions = { maxCount?: number };
/** Message 命令式 API 默认值（契约单一来源，@xui/core 的 messageSpec 复用此定义） */
export const messageDefaults = {
  type: 'info',
  duration: 3000,
  closable: false,
  maxCount: 5,
} as const satisfies Partial<MessageOptions> & { maxCount: number };
```

```ts
// select
export type SelectOption = { label: string; value: string; disabled?: boolean };
export type SelectValue = string | string[];

// tabs
export type TabItem = { label: string; value: string; disabled?: boolean };

// breadcrumb
export type BreadcrumbItem = { label: string; href?: string; disabled?: boolean };

// spin
export type SpinSize = 'sm' | 'md' | 'lg';

// progress
export type ProgressStatus = 'normal' | 'success' | 'error';

// popconfirm
export type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right';
```

## 使用示例

### 1. 组件逻辑工厂（以 Button / Select 为例）

```ts
import { createButtonLogic, createSelectLogic } from '@xui/shared';

// Button：非受控模式
const button = createButtonLogic({
  disabled: false,
  loading: false,
  onClick: (e: MouseEvent) => console.log('click', e),
});

const unsubscribe = button.subscribe((state) => {
  //   ^? { disabled: boolean; loading: boolean }
  console.log('button state', state);
});

button.handleClick(new MouseEvent('click')); // 触发 onClick
button.updateOptions({ loading: true });      // 适配层 Props 变更时同步
button.getState();                            // { disabled: false, loading: true }
unsubscribe();                                // 取消订阅

// Select：受控模式（提供 value 即进入受控，内部不更新选中值）
const select = createSelectLogic({
  value: 'a',
  options: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b', disabled: true },
  ],
  onChange: (value) => {
    // 适配层在 onChange 中更新受控 value 并通过 updateOptions 同步回来
    console.log('selected', value);
  },
});

select.toggleOpen();                  // 展开面板，高亮当前选中项
select.moveHighlight(1);              // 键盘下移（跳过禁用项）
select.confirmHighlight();            // 确认当前高亮项
select.getState().filteredOptions;    // 过滤后的选项列表（引用变化驱动重渲染）
```

### 2. 主题运行时 API

```ts
import { getTheme, setTheme, toggleTheme, subscribeTheme, setThemeTokens } from '@xui/shared';

const unsubscribe = subscribeTheme((theme) => {
  // theme: 'light' | 'dark'
  console.log('theme changed to', theme);
});

toggleTheme();        // light → dark（写入 <html data-theme="dark">）
getTheme();           // 'dark'
setTheme('light');    // 切回浅色（移除 data-theme 属性）

setThemeTokens({
  '--xui-color-primary': '#1677ff', // 全站 CSS 自定义变量，作用于 <html>
});
```

### 3. 国际化运行时 API

```ts
import {
  getLocale,
  setLocale,
  registerLocale,
  subscribeLocale,
  getLocaleData,
  zhCN,
  enUS,
} from '@xui/shared';

setLocale('en-US');                 // 切换到英文
getLocale();                        // 'en-US'
getLocaleData().modal.ok;            // 'OK'

// 注册自定义语言包（部分字段，未提供字段回退基底）
registerLocale('ja-JP', {
  modal: { ok: '確認', cancel: 'キャンセル' },
});

subscribeLocale((data) => {
  console.log('locale pack updated', data.pagination.prev);
});
```

### 4. 浮层视口避让

```ts
import { resolveFloatingPosition, getViewport, bindViewportUpdate } from '@xui/shared';

const trigger = document.querySelector<HTMLElement>('.trigger')!.getBoundingClientRect();
const popper = document.querySelector<HTMLElement>('.popper')!.getBoundingClientRect();

const { placement, shift } = resolveFloatingPosition(
  trigger,
  popper,
  getViewport(),
  { placement: 'top', gap: 8, viewportPadding: 8 },
);
// placement 可能因空间不足翻转为 'bottom'；shift 为交叉轴钳制偏移

// 滚动 / resize 后重算
const unbind = bindViewportUpdate(() => {
  const next = resolveFloatingPosition(/* ... */);
  // 重新应用方位与偏移
});
```

### 5. 虚拟滚动原语

```ts
import { createVirtualListLogic } from '@xui/shared';

const list = createVirtualListLogic({
  itemCount: 1000,
  itemHeight: 32,
  viewportHeight: 400,
  overscan: 5,
});

list.subscribe((state) => {
  // state.startIndex / endIndex / offsetY / fillerHeight / totalHeight / scrollTop
  // 适配层渲染 [startIndex, endIndex] 区间 + 前后占位 spacer
});

// 适配层在 onScroll 时调用
list.scrollTo(scrollTop);
list.scrollToIndex(500);      // 滚动到第 500 项（align 默认 auto）
list.scrollToIndex(500, 'start');
```

### 6. 插件系统

```ts
import { applyPlugins, type XuiPlugin } from '@xui/shared';
import { createCounterLogic } from './my-logic'; // 假设的逻辑工厂

const logPlugin: XuiPlugin<MyOptions, MyState> = {
  name: 'logger',
  onStateChange: (state) => console.log('[logger] state', state),
  beforeUpdateOptions: (next) => {
    // 可拦截并替换本次 updateOptions 入参
    return { ...next, extra: true };
  },
  destroy: () => console.log('[logger] destroyed'),
};

const enhanced = applyPlugins(createCounterLogic({}), [logPlugin]);
enhanced.subscribe((s) => { /* ... */ });
enhanced.updateOptions({ count: 1 }); // 触发 beforeUpdateOptions → 核心逻辑 → afterUpdateOptions
enhanced.dispose();                   // 触发插件 destroy（幂等）
```

### 7. 焦点陷阱（Modal 等浮层共用）

```ts
import { trapFocus } from '@xui/shared';

// 适配层在容器 keydown 时调用
dialogEl.addEventListener('keydown', (e) => {
  trapFocus(e, dialogEl); // Tab 时循环焦点到容器内，必要时 preventDefault
});
```

## 关键设计约定

1. **零框架依赖**：shared 不 import Vue / React / 任何框架运行时；所有状态管理通过闭包 + `subscribe` 模式实现，可被双端安全复用。
2. **shared 不允许 import @xui/core**：依赖方向严格为 `core → shared`。逻辑层共用类型（`SelectOption` / `TabItem` / `MessageType` / `BreadcrumbItem` / `TableRow` / `TableSort` / `TableRowKey` / `TableRowSelection` / `TableSortOrder` / `PopconfirmPlacement` / `SpinSize` / `ProgressStatus` 等）在 shared 本地定义并导出，core 复用 / 对齐（结构一致）。
3. **双端共用同一逻辑**：locale / theme / floating / virtual-list / plugin / focus-trap 等模块框架无关，Vue / React 适配层仅做 DOM 桥接（绑定事件、读取 `getBoundingClientRect`、写 `data-theme` 属性等）。
4. **受控模式约定**：受控判定为 `options.value !== undefined`（`InputNumber` / `Modal` 的 `null` / `false` 也是有效受控值）；受控模式仅回调 `onXxx`、不更新内部状态，由适配层通过 `updateOptions` 同步外部值；`Message` / `Tooltip` / `Popconfirm` / `Tag` / `Alert` / `Avatar` / `Breadcrumb` 等非 `value` 驱动组件按各自语义（`visible` / `open` / `failed` / 内部 `Set`）实现受控 / 非受控。
5. **稳定引用语义**：`getLocaleData()` 恒返回缓存引用（仅语言切换 / 当前包重新注册时重建），满足 React `useSyncExternalStore` 快照语义；逻辑工厂的 `getState()` 返回浅拷贝，`items` / `filteredOptions` / `selectedRowKeys` 等数组字段每次变更均生成新引用，适配层可直接依赖引用变化驱动重渲染。
6. **SSR 安全降级**：主题、视口、`bindViewportUpdate` 等涉及 DOM 的 API 在无 `document` / `window` 环境下安全降级（不写入、返回默认值、返回空解绑函数）。
7. **Message 为命令式 API**：`createMessageManager` 维护消息队列，`open` 返回 `MessageHandle`；`messageDefaults` 为命令式 API 默认值契约的单一来源（core 重导出）；Message 不进 contract-test 矩阵。
8. **插件健壮性**：`applyPlugins` 的所有插件钩子经 `try/catch` 隔离，插件抛错仅 `console.error`、不中断组件核心功能；同名插件按名去重；零插件时直通原实例（零包装开销）。

## 新增组件流程（逻辑层职责）

新增组件固定流程（四层骨架，可通过官方脚手架 `create-component.ts` 一键生成）中，shared 承担第 2、3 步：

1. **core 契约定义** →（在 `@xui/core` 完成 Props / Events / Slots / State / Logic 契约与 `xxxSpec`）
2. **shared 核心逻辑实现**：在 `packages/shared/src/components/<name>/` 下新增 `create-xxx-logic.ts`，实现 `createXxxLogic(options?: XxxLogicOptions): XxxLogicInstance`，返回值满足 `LogicInstance` + 组件特有交互方法；共用类型（如选项 / 行 / 标签项）在本地定义并导出；在 `shared/src/index.ts` 追加 `export * from './components/<name>'`。
3. **核心层单元测试**：在 `__tests__/create-xxx-logic.test.ts` 中为纯逻辑编写单测（vitest，不依赖 DOM / 框架），覆盖受控 / 非受控、边界值、键盘导航等。
4. **双端适配** →（在 `@xui/vue` / `@xui/react` 完成）
5. **双端组件测试** →
6. **双端契约对齐校验** →

> 依赖链路：`core`（契约）→ `shared`（逻辑）→ `vue` / `react`（适配）。shared 是状态机的唯一实现，双端通过相同规格驱动状态。
