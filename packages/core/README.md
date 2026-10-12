# @xui-design/core

> 跨框架组件库的**框架无关抽象层**：定义所有组件的 Props / Events / Slots 类型契约与 `ComponentSpec` 规格契约，被 `@xui-design/vue` 与 `@xui-design/react` 共同引用，确保双端 API 逐字一致。

- 包名：`@xui-design/core`
- 版本：`0.1.0`
- 入口：`dist/index.mjs`（ESM）/ `dist/index.cjs`（CJS）/ `dist/types/index.d.ts`（类型）
- 子路径导出：`./spec`、`./types`、`./components/*`（按组件细粒度引用）

## 职责边界

### 这个包做什么

- 定义组件契约的**基础类型原语**（`Constructor` / `PropType` / `LogicInstance` 等）。
- 定义 `ComponentSpec` 组件规格契约：将一个组件的 `props`（运行时 schema + 默认值）、`events`、`slots`、`useLogic`（指向 `@xui-design/shared` 的逻辑工厂）聚合为一份“共享合同”。
- 为 25 个组件分别定义 `XxxProps` / `XxxEvents` / `XxxSlots` / `XxxState` / `XxxLogic` 类型别名与 `xxxSpec` 规格常量。
- 定义各组件 Props 的**默认值**（统一收口在 core 层 spec 的 `defaults` 中）。
- 重导出 Message 命令式 API 的默认值契约 `messageDefaults`（单一来源为 `@xui-design/shared`）。

### 这个包不做什么

- **不实现任何组件逻辑**：`useLogic` 仅指向 `@xui-design/shared` 的 `createXxxLogic` 工厂，core 自身不包含状态机。
- **不产出任何 DOM / 渲染产物**：纯类型 + 规格常量，`sideEffects: false`。
- **不依赖 Vue / React**：零框架运行时依赖，可被双端安全引用。
- **不定义逻辑层的 Options/State/LogicInstance 形状**：该形状由 `@xui-design/shared` 的 `LogicInstance` 提供，core 的 `LogicInstance` 与其结构兼容（由 `satisfies ComponentSpec<...>` 编译期校验保证一致）。

## 依赖关系

### 它依赖哪些 @xui-design/* 包

- `@xui-design/shared`（`workspace:*`，运行时依赖）：core 的 spec 在 `useLogic` 中调用 shared 的 `createXxxLogic` / `createMessageManager`，并从 shared 重导出 `messageDefaults`。

### 被哪些包依赖

- `@xui-design/vue`：Vue 3 适配层，按 core 契约实现 `<Xxx>` 组件与 props/slots 桥接。
- `@xui-design/react`：React 19 适配层，按 core 契约实现 `<Xxx>` 组件与 renderXxx 回调桥接。
- 适配层**不得**新增 core 契约之外的额外 Props / 事件 / 插槽。

## 模块结构

```
packages/core/src/
├── index.ts          # 顶层导出：CORE_VERSION + 重导出 types/spec 与 25 个组件
├── types.ts          # 基础类型原语（Constructor/PropType/LogicInstance 等）
├── spec.ts           # ComponentSpec 规格契约（PropsDefinition/EventsDefinition/...）
└── components/
    ├── <component>/
    │   ├── index.ts   # 统一：export * from './types'; export * from './spec';
    │   ├── types.ts   # XxxProps/XxxEvents/XxxSlots/XxxState/XxxLogic 类型别名
    │   └── spec.ts    # xxxSpec 常量（satisfies ComponentSpec<...>）
    └── ...（共 25 个组件目录）
```

25 个组件目录（与 `src/index.ts` 的重导出顺序一致）：

| # | 组件 | spec 常量 | useLogic 绑定（@xui-design/shared） |
|---|------|-----------|------------------------------|
| 1 | button | `buttonSpec` | `createButtonLogic` |
| 2 | input | `inputSpec` | `createInputLogic` |
| 3 | switch | `switchSpec` | `createSwitchLogic` |
| 4 | checkbox | `checkboxSpec` | `createCheckboxLogic` |
| 5 | tag | `tagSpec` | `createTagLogic` |
| 6 | alert | `alertSpec` | `createAlertLogic` |
| 7 | radio-group | `radioGroupSpec` | `createRadioGroupLogic` |
| 8 | radio | `radioSpec` | `createRadioLogic` |
| 9 | progress | `progressSpec` | `createProgressLogic` |
| 10 | badge | `badgeSpec` | `createBadgeLogic` |
| 11 | avatar | `avatarSpec` | `createAvatarLogic` |
| 12 | empty | `emptySpec` | `createEmptyLogic` |
| 13 | select | `selectSpec` | `createSelectLogic` |
| 14 | tabs | `tabsSpec` | `createTabsLogic` |
| 15 | message | `messageSpec` | `createMessageManager` |
| 16 | tooltip | `tooltipSpec` | `createTooltipLogic` |
| 17 | pagination | `paginationSpec` | `createPaginationLogic` |
| 18 | date-picker | `datePickerSpec` | `createDatePickerLogic` |
| 19 | table | `tableSpec` | `createTableLogic` |
| 20 | spin | `spinSpec` | `createSpinLogic` |
| 21 | breadcrumb | `breadcrumbSpec` | `createBreadcrumbLogic` |
| 22 | skeleton | `skeletonSpec` | `createSkeletonLogic` |
| 23 | input-number | `inputNumberSpec` | `createInputNumberLogic` |
| 24 | popconfirm | `popconfirmSpec` | `createPopconfirmLogic` |
| 25 | modal | `modalSpec` | `createModalLogic` |

## 完整导出 API 清单

> 以下签名与源码逐字一致。类型别名统一使用 `type`（而非 `interface`）以保证与 `Record<string, unknown>` 约束的结构兼容性。

### 顶层常量

```ts
export const CORE_VERSION = '0.0.0';
```
core 包版本标识常量。

### 基础类型原语（来自 `src/types.ts`）

```ts
export type Constructor<T = unknown> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => T;
```
属性运行时类型构造器（供 Vue props 校验等运行时 schema 使用）；`args` 用 `any[]` 以与 lib 中 `FunctionConstructor` 的 `new (...argArray: any[])` 声明兼容。

```ts
export type PropType = Constructor | ReadonlyArray<Constructor>;
```
支持单个构造器或构造器数组（Vue 风格的一多类型声明）。

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
  /** 获取当前状态快照（浅拷贝） */
  getState: () => S;
  /** 外部更新配置（Props 变更时由适配层调用） */
  updateOptions: (options: Partial<P>) => void;
}
```
逻辑实例通用形状——所有组件逻辑工厂的返回值都满足该接口（与 `@xui-design/shared` 的 `LogicInstance` 结构兼容）。

### 组件规格契约（来自 `src/spec.ts`）

```ts
export interface PropsDefinition<P extends Record<string, unknown>> {
  /** 每个 prop 的运行时类型（构造器或构造器数组） */
  type: { [K in keyof P]: PropType };
  /** 默认值 */
  defaults: Partial<P>;
  /** 校验器：返回错误信息数组，空数组表示合法 */
  validator?: (props: P) => string[];
}
```
Props 运行时定义：类型映射 + 默认值 + 可选校验器。

```ts
export interface EventDefinition {
  /** 事件说明 */
  description: string;
  /** 载荷的 TS 类型引用名（文档用途） */
  payloadType?: string;
}
```
单个事件定义。

```ts
export type EventsDefinition<E extends Record<string, unknown>> = {
  [K in keyof E]-?: EventDefinition;
};
```
事件定义映射：事件名 -> 定义。

```ts
export interface SlotDefinition {
  /** 插槽说明 */
  description?: string;
  /** 作用域插槽参数类型 */
  props?: Record<string, unknown>;
  /** 默认内容 */
  fallback?: string;
}
```
单个插槽定义。

```ts
export type SlotsDefinition<S extends Record<string, unknown>> = {
  [K in keyof S]-?: SlotDefinition;
};
```
插槽定义映射：插槽名 -> 定义。

```ts
export type LogicLike<P extends Record<string, unknown>> = {
  subscribe: Subscribe<unknown>;
  getState: () => unknown;
  updateOptions: (options: Partial<P>) => void;
};
```
逻辑实例最小形状约束（`subscribe`/`getState` 以 `unknown` 为界保证协变兼容）。

```ts
export interface ComponentSpec<
  P extends Record<string, unknown>,
  E extends Record<string, unknown>,
  S extends Record<string, unknown>,
  L extends LogicLike<P>,
> {
  /** 组件名，Vue 和 React 保持一致 */
  name: string;
  /** Props 定义（运行时 schema + 编译时 TS 类型） */
  props: PropsDefinition<P>;
  /** 事件定义 */
  events: EventsDefinition<E>;
  /** 插槽定义 */
  slots: SlotsDefinition<S>;
  /** 核心 hook 工厂（指向 @xui-design/shared 的逻辑工厂） */
  useLogic: (options: P) => L;
}
```
组件规格——Vue 与 React 适配层的共享合同。

### 组件契约（25 个）

每个组件目录的 `index.ts` 统一执行 `export * from './types'; export * from './spec';`，即导出 5 个类型别名（`XxxProps` / `XxxEvents` / `XxxSlots` / `XxxState` / `XxxLogic`）+ 1 个规格常量（`xxxSpec`）。部分组件额外导出辅助类型。下面按组件列出 `Props` 契约（主契约）与各自的事件 / 插槽 / 状态 / 逻辑类型名。

#### Button

```ts
export type ButtonProps = {
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'danger' | 'link';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 禁用状态 */
  disabled?: boolean;
  /** 加载状态（ loading 时点击被忽略） */
  loading?: boolean;
  /** 是否块级元素（宽度撑满容器） */
  block?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 点击回调（由适配层桥接为框架事件） */
  onClick?: (event: MouseEvent) => void;
};
```
关联类型：`ButtonEvents`（`click: (event: MouseEvent) => void`）、`ButtonSlots`（`default` / `icon` / `loadingIcon`）、`ButtonState`（`disabled` / `loading`）、`ButtonLogic`（`LogicInstance<ButtonProps, ButtonState> & { handleClick: (event: MouseEvent) => void }`）。
规格常量：`buttonSpec`。

#### Input

```ts
export type InputProps = {
  /** 受控值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  /** 原生 input 类型 */
  type?: 'text' | 'password' | 'number' | 'email' | 'search' | 'tel' | 'url';
  /** 占位文本 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 只读状态 */
  readonly?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 是否显示清除图标 */
  clearable?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 输入回调（每次键入） */
  onInput?: (value: string) => void;
  /** 值变更提交回调（失焦或回车） */
  onChange?: (value: string) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  /** 清空回调（点击清除图标） */
  onClear?: () => void;
};
```
关联类型：`InputEvents`（`input` / `change` / `focus` / `blur` / `clear`）、`InputSlots`（`prefix` / `suffix` / `clearIcon`）、`InputState`（`value` / `focused` / `disabled` / `readonly`）、`InputLogic`（含 `handleInput` / `handleChange` / `handleFocus` / `handleBlur` / `handleClear`）。
规格常量：`inputSpec`。

#### Switch

```ts
export type SwitchProps = {
  /** 受控选中状态（提供时进入受控模式） */
  value?: boolean;
  /** 非受控初始状态 */
  defaultValue?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 禁用状态 */
  disabled?: boolean;
  /** 加载状态（切换被忽略） */
  loading?: boolean;
  /** 开启态展示文本（显示在轨道内滑块左侧，超长自动截断；不传保持纯开关模式） */
  checkedText?: string;
  /** 关闭态展示文本（显示在轨道内滑块右侧，超长自动截断；不传保持纯开关模式） */
  uncheckedText?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 状态变更回调（载荷为切换后的选中值） */
  onChange?: (value: boolean) => void;
};
```
关联类型：`SwitchEvents`（`change: (value: boolean) => void`）、`SwitchSlots`（`loadingIcon`）、`SwitchState`（`checked` / `disabled` / `loading`）、`SwitchLogic`（含 `toggle: () => void`）。
规格常量：`switchSpec`。

#### Checkbox

```ts
export type CheckboxProps = {
  /** 受控选中状态（提供时进入受控模式） */
  value?: boolean;
  /** 非受控初始状态 */
  defaultValue?: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 半选状态（点击后切换为全选） */
  indeterminate?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 状态变更回调（载荷为切换后的选中值） */
  onChange?: (value: boolean) => void;
};
```
关联类型：`CheckboxEvents`（`change: (value: boolean) => void`）、`CheckboxSlots`（`default` / `checkIcon` / `indeterminateIcon`）、`CheckboxState`（`checked` / `disabled` / `indeterminate`）、`CheckboxLogic`（含 `toggle: () => void`）。
规格常量：`checkboxSpec`。

#### Tag

```ts
export type TagProps = {
  /** 语义类型 */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 是否可关闭（显示关闭按钮，点击后隐藏标签并触发 close） */
  closable?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 关闭回调（组件隐藏后触发） */
  onClose?: () => void;
};
```
关联类型：`TagEvents`（`close: () => void`）、`TagSlots`（`default` / `closeIcon`）、`TagState`（`visible` / `closable`）、`TagLogic`（含 `handleClose: () => void`）。
规格常量：`tagSpec`。

#### Alert

```ts
export type AlertProps = {
  /** 语义类型 */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** 标题 */
  title?: string;
  /** 辅助描述（default 插槽的回退内容） */
  description?: string;
  /** 是否可关闭（显示关闭按钮，点击后隐藏并触发 close） */
  closable?: boolean;
  /** 是否显示类型图标 */
  showIcon?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 关闭回调（组件隐藏后触发） */
  onClose?: () => void;
};
```
关联类型：`AlertEvents`（`close: () => void`）、`AlertSlots`（`default` / `title` / `icon` / `closeIcon`）、`AlertState`（`visible` / `closable`）、`AlertLogic`（含 `handleClose: () => void`）。
规格常量：`alertSpec`。

#### Radio

```ts
export type RadioProps = {
  /** 单选项取值（组内唯一，与 RadioGroup 的 value 做相等比较） */
  value: string;
  /** 禁用当前选项（与 RadioGroup 的 disabled 叠加生效） */
  disabled?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};
```
关联类型：`RadioEvents`（`Record<string, never>`，选中变更统一由 RadioGroup 触发）、`RadioSlots`（`default`）、`RadioState`（`disabled`）、`RadioLogic`（`LogicInstance<RadioProps, RadioState>`，无额外方法）。
规格常量：`radioSpec`。
说明：Radio 是 RadioGroup 的子项，通过组上下文（Vue provide/inject、React Context）受控，自身不维护选中状态、不对外发事件。

#### RadioGroup

```ts
export type RadioOption = {
  /** 选项文案 */
  label: string;
  /** 选项取值 */
  value: string;
  /** 禁用当前选项 */
  disabled?: boolean;
};

export type RadioGroupProps = {
  /** 受控选中值（提供时进入受控模式） */
  value?: string;
  /** 非受控初始选中值 */
  defaultValue?: string;
  /** 禁用整组 */
  disabled?: boolean;
  /** 选项数组（提供后按 options 渲染，忽略 default 插槽） */
  options?: RadioOption[];
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 选中值变更回调（载荷为选中的选项值） */
  onChange?: (value: string) => void;
};
```
关联类型：`RadioGroupEvents`（`change: (value: string) => void`）、`RadioGroupSlots`（`default`）、`RadioGroupState`（`value: string | null` / `disabled`）、`RadioGroupLogic`（含 `select: (value: string) => void`）。
规格常量：`radioGroupSpec`。

#### Progress

```ts
export type ProgressType = 'line' | 'circle';
export type ProgressStatus = 'normal' | 'success' | 'error';

export type ProgressProps = {
  /** 进度百分比（0-100，越界自动收敛，非数值按 0 处理） */
  percent?: number;
  /** 进度条类型 */
  type?: ProgressType;
  /** 进度条粗细（px；circle 类型为 SVG 描边宽度） */
  strokeWidth?: number;
  /** 是否显示百分比文本 */
  showText?: boolean;
  /** 进度状态（percent 达到 100 且未显式指定 status/error 时派生为 success） */
  status?: ProgressStatus;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};
```
关联类型：`ProgressEvents`（`Record<string, never>`）、`ProgressSlots`（`Record<string, never>`）、`ProgressState`（`percent` / `status` / `strokeWidth`）、`ProgressLogic`（纯展示，无交互方法）。
规格常量：`progressSpec`。

#### Badge

```ts
export type BadgeProps = {
  /** 徽标数值（未提供时不显示；dot 模式下仅作为无障碍语义参考） */
  count?: number;
  /** 数值上限（超出显示 `${max}+`） */
  max?: number;
  /** 点状徽标（忽略 count 与 max，仅显示小红点） */
  dot?: boolean;
  /** count 为 0 时是否显示徽标（默认隐藏） */
  showZero?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};
```
关联类型：`BadgeEvents`（`Record<string, never>`）、`BadgeSlots`（`default`）、`BadgeState`（`visible` / `text: string | null`）、`BadgeLogic`（纯展示，无交互方法）。
规格常量：`badgeSpec`。

#### Avatar

```ts
export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarShape = 'circle' | 'square';

export type AvatarProps = {
  /** 头像尺寸 */
  size?: AvatarSize;
  /** 头像形状 */
  shape?: AvatarShape;
  /** 图片地址（加载失败时回退为默认图标或 default 插槽内容） */
  src?: string;
  /** 图片 alt 文案（未提供时按装饰图处理，读屏跳过） */
  alt?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 图片加载失败回调 */
  onError?: () => void;
};
```
关联类型：`AvatarEvents`（`error: () => void`）、`AvatarSlots`（`default` / `icon`）、`AvatarState`（`failed`）、`AvatarLogic`（含 `handleError: () => void`）。
规格常量：`avatarSpec`。

#### Empty

```ts
export type EmptyProps = {
  /** 空状态描述文案（未提供或空白时不渲染描述，由外部决定文案以避免内置 i18n 问题） */
  description?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};
```
关联类型：`EmptyEvents`（`Record<string, never>`）、`EmptySlots`（`default` / `image`）、`EmptyState`（`description: string | null`）、`EmptyLogic`（纯展示，无交互方法）。
规格常量：`emptySpec`。

#### Select

```ts
export type SelectOption = {
  /** 选项文案 */
  label: string;
  /** 选项值（组内唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

export type SelectValue = string | string[];

export type SelectProps = {
  /** 受控选中值（提供即受控）；多选模式为 string[] */
  value?: SelectValue;
  /** 非受控初始选中值 */
  defaultValue?: SelectValue;
  /** 选项数组 */
  options: SelectOption[];
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时；多选模式清空全部） */
  clearable?: boolean;
  /** 多选模式：选中值为数组，点击选项切换选中且面板不关闭 */
  multiple?: boolean;
  /** 可搜索模式：面板顶部显示搜索框，按选项文案过滤 */
  searchable?: boolean;
  /** 虚拟滚动模式（大数据量选项；需配合 maxHeight 固定面板视口高） */
  virtual?: boolean;
  /** 下拉面板最大高度（px，默认 264；虚拟模式下即视口高度） */
  maxHeight?: number;
  /** 附加到根节点的自定义类名 */
  className?: string;
  /** 附加到根节点的内联样式（支持 CSS 自定义属性） */
  style?: Record<string, string>;
  /** 选中值变更回调（契约事件；多选时载荷为 string[]） */
  onChange?: (value: SelectValue) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};
```
关联类型：`SelectEvents`（`change: (value: SelectValue) => void` / `clear: () => void`）、`SelectSlots`（`clearIcon` / `suffixIcon`）、`SelectState`（`value` / `open` / `activeIndex` / `disabled` / `searchQuery` / `filteredOptions`）、`SelectLogic`（含 `toggleOpen` / `close` / `select` / `clear` / `moveHighlight` / `confirmHighlight` / `setSearch`）。
规格常量：`selectSpec`。

#### Tabs

```ts
export type TabItem = {
  /** 标签文案 */
  label: string;
  /** 标签值（唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

export type TabsProps = {
  /** 受控激活值（提供即受控） */
  value?: string;
  /** 非受控初始激活值 */
  defaultValue?: string;
  /** 标签页配置 */
  items: TabItem[];
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 激活项变更回调（契约事件） */
  onChange?: (value: string) => void;
};
```
关联类型：`TabsEvents`（`change: (value: string) => void`）、`TabsSlots`（`default: { item: TabItem }`，作用域插槽）、`TabsState`（`value: string | null`）、`TabsLogic`（含 `activate: (value: string) => void` / `moveActive: (delta: 1 | -1) => void`）。
规格常量：`tabsSpec`。

#### Message（命令式 API）

```ts
export type MessageType = 'info' | 'success' | 'warning' | 'error';

export type MessageOptions = {
  /** 消息类型（默认 'info'） */
  type?: MessageType;
  /** 消息内容 */
  content: string;
  /** 自动关闭时长（ms），0 表示不自动关闭，默认 3000 */
  duration?: number;
  /** 是否显示关闭按钮（默认 false） */
  closable?: boolean;
  /** 自定义类型图标：内层 SVG 标记（与 @xui-design/icons 数据源同构，不含 <svg> 壳）；不传使用按 type 内置图标 */
  icon?: string;
  /** 更新键：相同 key 再次 open 时原地更新该条消息（不新增、重置计时） */
  key?: string | number;
  /** 消息关闭回调（自动关闭 / 手动关闭 / 超出 maxCount 挤出时触发） */
  onClose?: () => void;
};

export type MessageItem = {
  /** 唯一 id（自增） */
  id: number;
  type: MessageType;
  content: string;
  closable: boolean;
  /** 自定义类型图标（内层 SVG 标记；不传使用按 type 内置图标） */
  icon?: string;
  /** 更新键（open 时携带则原样透出，用于业务侧定位） */
  key?: string | number;
};

export type MessageHandle = {
  /** 手动关闭该条消息 */
  close: () => void;
};

export type MessageManagerOptions = {
  /** 同屏最大消息数，超出时移除最早一条（默认 5） */
  maxCount?: number;
};

export type MessageState = {
  /** 当前展示中的消息（新消息追加在尾部） */
  items: MessageItem[];
};

export type MessageEvents = Record<string, never>;
export type MessageSlots = Record<string, never>;

export type MessageLogic = LogicInstance<MessageManagerOptions, MessageState> & {
  /** 打开一条消息，返回可关闭句柄 */
  open: (options: MessageOptions) => MessageHandle;
  /** 按 id 关闭消息 */
  close: (id: number) => void;
  /** 关闭全部消息 */
  closeAll: () => void;
};
```
规格常量：`messageSpec`（`props` / `events` / `slots` 均为空，`useLogic: () => createMessageManager()`）。
额外导出：`export { messageDefaults };`（重导出自 `@xui-design/shared`，命令式 API 默认值契约单一来源）。
说明：Message 不属于声明式挂载组件，对外是 `message.info/success/...` 形态的命令式 API，双端适配层各自实现挂载容器并导出 `message` 单例。Message 不进 contract-test 矩阵。

#### Tooltip

```ts
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'hover' | 'focus';

export type TooltipProps = {
  /** 提示内容（content 插槽 / renderContent 回调优先） */
  content?: string;
  /** 弹出位置 */
  placement?: TooltipPlacement;
  /** 触发方式 */
  trigger?: TooltipTrigger;
  /** 禁用状态（禁用后不响应触发） */
  disabled?: boolean;
  /** 自定义类名（应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
};
```
关联类型：`TooltipEvents`（`Record<string, never>`）、`TooltipSlots`（`default` / `content`）、`TooltipState`（`open` / `disabled`）、`TooltipLogic`（含 `show: () => void` / `hide: () => void`）。
规格常量：`tooltipSpec`。
说明：`placement` / `trigger` 为纯展示配置，由适配层直接读取 Props，逻辑层仅管理 `open` / `disabled`。

#### Pagination

```ts
export type PaginationProps = {
  /** 受控当前页（提供即受控，从 1 开始） */
  value?: number;
  /** 非受控初始页码 */
  defaultValue?: number;
  /** 数据总条数 */
  total: number;
  /** 每页条数 */
  pageSize?: number;
  /** 禁用状态 */
  disabled?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 页码变更回调（契约事件） */
  onChange?: (page: number) => void;
};
```
关联类型：`PaginationEvents`（`change: (page: number) => void`）、`PaginationSlots`（`prevIcon` / `nextIcon`）、`PaginationState`（`page` / `pageCount` / `disabled`）、`PaginationLogic`（含 `goTo` / `prev` / `next`）。
规格常量：`paginationSpec`。

#### DatePicker

```ts
export type DatePickerProps = {
  /** 受控选中日期（'YYYY-MM-DD'，提供即受控） */
  value?: string;
  /** 非受控初始日期（'YYYY-MM-DD'） */
  defaultValue?: string;
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时） */
  clearable?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 选中值变更回调（契约事件） */
  onChange?: (value: string) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};
```
关联类型：`DatePickerEvents`（`change: (value: string) => void` / `clear: () => void`）、`DatePickerSlots`（`clearIcon` / `calendarIcon` / `prevIcon` / `nextIcon`）、`DatePickerState`（`value: string | null` / `open` / `viewYear` / `viewMonth` / `disabled`）、`DatePickerLogic`（含 `toggleOpen` / `close` / `prevMonth` / `nextMonth` / `select` / `clear`）。
规格常量：`datePickerSpec`。
契约约定：`value` 为 `'YYYY-MM-DD'` 格式字符串（零依赖、序列化友好），非法值回退 `null`，不引入 `Date` 对象契约。

#### Table

```ts
export type TableRow = Record<string, unknown>;
export type TableAlign = 'left' | 'center' | 'right';
export type TableSortOrder = 'asc' | 'desc' | null;
export type TableSort = {
  /** 触发排序的列 key */
  key: string;
  /** 新的排序方向（null 表示已取消排序） */
  order: TableSortOrder;
};
export type TableRowKey = string | number;
export type TableRowSelection = {
  /** 受控选中行键集合（提供时进入受控模式，选中状态由外部驱动） */
  selectedRowKeys?: TableRowKey[];
  /** 选中行变化回调（全量键集合 + 当前行数据快照） */
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  /** 指定行的选择框禁用（不可勾选，也不参与全选计数） */
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};
export type TableColumn = {
  /** 列标识（对应行数据的字段名，组内唯一） */
  key: string;
  /** 表头文案 */
  title: string;
  /** 列宽（数字按 px，字符串原样） */
  width?: number | string;
  /** 单元格对齐方式 */
  align?: TableAlign;
  /** 是否可排序（点击表头循环 升序 → 降序 → 取消） */
  sortable?: boolean;
  /** 自定义单元格渲染（返回字符串覆盖默认取值） */
  render?: (record: TableRow, index: number) => string;
};

export type TableProps = {
  /** 列定义数组 */
  columns: TableColumn[];
  /** 行数据数组 */
  dataSource: TableRow[];
  /** 行唯一键字段名（缺省时以行下标作为 key；行选择模式下必填以保证选择键稳定） */
  rowKey?: string;
  /** 斑马纹 */
  stripe?: boolean;
  /** 边框 */
  border?: boolean;
  /** 启用虚拟滚动（固定行高渲染可视窗口；需提供 height，rowHeight 缺省 40px） */
  virtual?: boolean;
  /** 滚动容器高度（数字按 px，字符串原样；虚拟滚动必填） */
  height?: number | string;
  /** 行高 px（虚拟滚动必需；非虚拟模式下作为行高样式生效） */
  rowHeight?: number;
  /** 行选择配置（提供后自动追加选择列） */
  rowSelection?: TableRowSelection;
  /** 根节点自定义类名（叠加在 xui-table 之后） */
  className?: string;
  /** 根节点内联样式（可覆盖组件级 CSS 变量，如 --xui-table-row-height） */
  style?: Record<string, string>;
  /** 排序变更回调（契约事件，非受控内部排序） */
  onSortChange?: (sort: TableSort) => void;
  /** 行点击回调（选择列单元格不触发） */
  onRowClick?: (record: TableRow, index: number) => void;
};
```
关联类型：`TableEvents`（`sortChange: (sort: TableSort) => void` / `rowClick: (record: TableRow, index: number) => void`）、`TableSlots`（`empty` / `sortIcon: { order: 'asc' | 'desc' }` 作用域插槽）、`TableState`（`sortKey` / `sortOrder` / `sortedData` / `selectedRowKeys` / `allSelected` / `indeterminate`）、`TableLogic`（含 `toggleSort` / `toggleRow` / `toggleAll`）。
规格常量：`tableSpec`。
说明：排序为非受控内部排序（客户端比较）；虚拟滚动由适配层基于 `@xui-design/shared` 的 `createVirtualListLogic` 组合，行选择由逻辑层维护。

#### Spin

```ts
export type SpinSize = 'sm' | 'md' | 'lg';

export type SpinProps = {
  /** 尺寸 */
  size?: SpinSize;
  /** 加载中状态（包裹内容时控制遮罩显隐） */
  spinning?: boolean;
  /** 提示文案（显示在指示器下方） */
  tip?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};
```
关联类型：`SpinEvents`（`Record<string, never>`）、`SpinSlots`（`default`）、`SpinState`（`size` / `spinning` / `tip: string | null`）、`SpinLogic`（纯展示，无交互方法）。
规格常量：`spinSpec`。

#### Breadcrumb

```ts
export type BreadcrumbItem = {
  /** 展示文本 */
  label: string;
  /** 链接地址（存在时渲染为 <a>，否则渲染为可点击 <span>） */
  href?: string;
  /** 禁用状态（不可点击） */
  disabled?: boolean;
};

export type BreadcrumbProps = {
  /** 面包屑项列表（最后一项视为当前页，不可点击） */
  items?: BreadcrumbItem[];
  /** 分隔符（默认 '/'） */
  separator?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 点击可导航项回调（末项与 disabled 项不触发） */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
};
```
关联类型：`BreadcrumbEvents`（`itemClick: (item: BreadcrumbItem, index: number) => void`）、`BreadcrumbSlots`（`default`）、`BreadcrumbState`（`items` / `separator`）、`BreadcrumbLogic`（含 `selectItem: (index: number) => void`）。
规格常量：`breadcrumbSpec`。

#### Skeleton

```ts
export type SkeletonProps = {
  /** 加载中状态（true 渲染骨架，false 渲染 default 插槽真实内容） */
  loading?: boolean;
  /** 是否显示头部头像占位 */
  avatar?: boolean;
  /** 段落行数 */
  rows?: number;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};
```
关联类型：`SkeletonEvents`（`Record<string, never>`）、`SkeletonSlots`（`default`）、`SkeletonState`（`loading` / `avatar` / `rows`）、`SkeletonLogic`（纯展示，无交互方法）。
规格常量：`skeletonSpec`。

#### InputNumber

```ts
export type InputNumberProps = {
  /** 当前值（提供即受控，null 表示空值；非法输入回退 null） */
  value?: number | null;
  /** 非受控初始值 */
  defaultValue?: number | null;
  /** 最小值（默认 -Infinity） */
  min?: number;
  /** 最大值（默认 +Infinity） */
  max?: number;
  /** 步长（默认 1，非正数回退 1） */
  step?: number;
  /** 小数位数（0-20 整数，缺省不应用精度） */
  precision?: number;
  /** 禁用状态 */
  disabled?: boolean;
  /** 占位文案 */
  placeholder?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 值变更回调（提交时触发；清空 / 非法输入载荷为 null） */
  onChange?: (value: number | null) => void;
};
```
关联类型：`InputNumberEvents`（`change: (value: number | null) => void`）、`InputNumberSlots`（`upIcon` / `downIcon`）、`InputNumberState`（`value` / `disabled` / `min` / `max` / `step` / `precision`）、`InputNumberLogic`（含 `stepValue: (direction: 1 | -1) => void` / `commitText: (text: string) => void`）。
规格常量：`inputNumberSpec`。
契约约定：`number | null`（空值 / 非法输入均为 `null`），ARIA spinbutton 模式。

#### Popconfirm

```ts
export type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right';

export type PopconfirmProps = {
  /** 确认文案（content 插槽 / renderContent 可覆盖） */
  content?: string;
  /** 确认按钮文本（未提供时取全局语言包 popconfirm.confirm） */
  confirmText?: string;
  /** 取消按钮文本（未提供时取全局语言包 popconfirm.cancel） */
  cancelText?: string;
  /** 气泡方位 */
  placement?: PopconfirmPlacement;
  /** 禁用状态（禁用后点击触发元素无效，运行时禁用收起已开气泡） */
  disabled?: boolean;
  /** 自定义类名（应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
  /** 点击确定回调（气泡收起后触发） */
  onConfirm?: () => void;
  /** 点击取消回调（气泡收起后触发） */
  onCancel?: () => void;
};
```
关联类型：`PopconfirmEvents`（`confirm: () => void` / `cancel: () => void`）、`PopconfirmSlots`（`default` / `content`）、`PopconfirmState`（`open` / `placement` / `disabled`）、`PopconfirmLogic`（含 `toggle` / `confirm` / `cancel` / `close`）。
规格常量：`popconfirmSpec`。
说明：CSS 包裹定位（复用 Tooltip 模式）；点击外部收起且不触发回调。

#### Modal

```ts
export type ModalProps = {
  /** 受控可见性（变更时由适配层同步给逻辑层） */
  visible?: boolean;
  /** 非受控初始可见性 */
  defaultVisible?: boolean;
  /** 标题 */
  title?: string;
  /** 宽度（数字按 px，字符串原样输出） */
  width?: number | string;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnEsc?: boolean;
  /** 确认按钮文案（默认 footer 生效；未提供时取全局语言包 modal.ok） */
  okText?: string;
  /** 取消按钮文案（默认 footer 生效；未提供时取全局语言包 modal.cancel） */
  cancelText?: string;
  /** 打开时是否将 Tab 焦点循环约束在弹窗内（默认 true） */
  trapFocus?: boolean;
  /** 自定义类名（Modal 应用于对话框面板；Tooltip/Popconfirm 应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
  onOpen?: () => void;
  onClose?: () => void;
  /** 确认回调（触发后自动关闭） */
  onOk?: () => void;
  /** 取消回调（触发后自动关闭） */
  onCancel?: () => void;
};
```
关联类型：`ModalEvents`（`open` / `close` / `ok` / `cancel`，均为 `() => void`）、`ModalSlots`（`default` / `title` / `footer` / `closeIcon`）、`ModalState`（`visible` / `closable`）、`ModalLogic`（含 `open` / `close` / `handleOk` / `handleCancel` / `handleMaskClick` / `handleEsc`）。
规格常量：`modalSpec`。

## 使用示例

### 引用契约类型与规格

```ts
import {
  buttonSpec,
  type ButtonProps,
  type ButtonLogic,
  type ComponentSpec,
} from '@xui-design/core';

// 读取 core 层统一定义的默认值
const defaults = buttonSpec.props.defaults;
//    ^? { type: 'default'; size: 'md'; disabled: false; loading: false; block: false }

// 读取运行时类型 schema（供 Vue props 校验等场景）
const typeSchema = buttonSpec.props.type;
//    ^? { type: StringConstructor; size: StringConstructor; ... }

// 通过 useLogic 创建逻辑实例（实际由 @xui-design/shared 的 createButtonLogic 实现）
const logic: ButtonLogic = buttonSpec.useLogic({
  type: 'primary',
  disabled: false,
  loading: false,
  onClick: (e: MouseEvent) => console.log('clicked', e),
} as ButtonProps);

const state = logic.getState();
//    ^? { disabled: boolean; loading: boolean }
```

### 按子路径细粒度引用

```ts
import { buttonSpec } from '@xui-design/core/components/button';
import type { ComponentSpec } from '@xui-design/core/spec';
import type { LogicInstance } from '@xui-design/core/types';
```

### Message 命令式 API 默认值契约

```ts
import { messageDefaults } from '@xui-design/core';

// messageDefaults 由 @xui-design/shared 单一来源定义，core 重导出
// { type: 'info'; duration: 3000; closable: false; maxCount: 5 }
const { duration, maxCount } = messageDefaults;
```

> Message 的 `message.info/success/warning/error/open/closeAll` 单例由 `@xui-design/vue` 与 `@xui-design/react` 各自实现挂载容器后导出，core 仅提供类型与默认值契约。

## 关键设计约定

1. **core 是唯一契约基准**：Vue / React 适配层不得新增 core 契约之外的额外 Props / 事件 / 插槽；双端 API 一致性由 `satisfies ComponentSpec<...>` 编译期保证。
2. **shared 不允许 import @xui-design/core**：逻辑层类型（`SelectOption` / `TabItem` / `MessageType` / `BreadcrumbItem` / `TableRow` 等）在 `@xui-design/shared` 本地定义并导出，core 复用 / 对齐（结构一致，core 侧为同一类型别名）。
3. **受控模式统一约定**：受控值统一通过 `value` prop 传入（Select 多选为 `value: string[]`、Modal 为 `visible`、InputNumber 允许 `null` 空值），值变更回调按语义命名为 `onChange` / `onInput` / `onClear` / `onConfirm` / `onCancel` / `onSortChange` / `onRowClick` / `onItemClick` / `onOpen` / `onClose` / `onOk` / `onError` 等；**默认值统一定义在 core 层** spec 的 `defaults` 中。
4. **插槽映射规则**：Vue 具名插槽对应 React `renderXxx` 回调；作用域插槽（如 Tabs `default: { item: TabItem }`、Table `sortIcon: { order: 'asc' | 'desc' }`）对应回调函数类型 Props。
5. **类型别名优先**：所有组件契约类型使用 `type`（而非 `interface`）声明，以保证与 `Record<string, unknown>` 约束的结构兼容性。
6. **Message 为命令式 API**：`message.info/success/warning/error/open/closeAll` 不进 contract-test 矩阵；其默认值契约 `messageDefaults` 由 `@xui-design/shared` 单一来源定义，core 重导出。

## 新增组件流程

新增组件固定流程（四层骨架，可通过官方脚手架 `create-component.ts` 一键生成）：

1. **core 契约定义**：在 `packages/core/src/components/<name>/` 下新增 `types.ts`（`XxxProps` / `XxxEvents` / `XxxSlots` / `XxxState` / `XxxLogic`）与 `spec.ts`（`xxxSpec satisfies ComponentSpec<...>`，`useLogic` 指向待实现的 `createXxxLogic`）；在 `src/index.ts` 追加 `export * from './components/<name>'`。
2. **shared 核心逻辑实现**：在 `packages/shared/src/components/<name>/` 下实现 `create-xxx-logic.ts`（返回 `XxxLogicInstance`，含 `subscribe` / `getState` / `updateOptions` + 交互方法），并在 `shared/src/index.ts` 追加导出。
3. **核心层单元测试**：为 shared 的 `create-xxx-logic` 编写纯逻辑单测（不依赖 DOM / 框架）。
4. **双端适配**：`@xui-design/vue` 与 `@xui-design/react` 各自按 core 契约实现 `<Xxx>` 组件，桥接 props / 事件 / 插槽到框架原语。
5. **双端组件测试**：为 Vue / React 适配组件编写渲染与交互测试。
6. **双端契约对齐校验**：跑 contract-test 矩阵，校验双端 Props / 事件 / 插槽行为一致（Message 命令式 API 不进该矩阵）。

> 依赖链路：`core`（契约）→ `shared`（逻辑）→ `vue` / `react`（适配）。core 是 contract-test 的唯一基准。
