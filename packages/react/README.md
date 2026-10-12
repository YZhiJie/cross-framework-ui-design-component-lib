# @xui/react

跨框架组件库的 **React 19 适配层**：将 `@xui/shared` 的框架无关核心逻辑桥接到 React 状态系统，对外暴露一组与 Vue 适配层行为对齐的声明式函数组件。

> 类型契约来自 `@xui/core`，纯逻辑来自 `@xui/shared`，样式来自 `@xui/styles`，图标来自 `@xui/icons`。本包不重复实现任何核心逻辑。

## 职责边界

**适配层做什么：**

- 用 React 19 `ref-as-prop`（无需 `forwardRef`）+ `useSyncExternalStore` 把核心层（`createXxxLogic`）的状态接到 React 渲染流程
- 把 React 的 `onXxx` 回调 / `children` / `renderXxx` 渲染回调翻译成核心层的回调契约
- 通过 `useEffect` 把 props 变更同步到 `logic.updateOptions`，保证受控模式 value 变更可达
- 通过 `useImperativeHandle` 暴露命令式 API（`ButtonRef` / `ModalRef` 等），与 Vue 端 `defineExpose` 对齐
- 处理 DOM 绑定、ARIA 属性、键盘交互、`createPortal`、虚拟滚动等渲染细节

**适配层不做什么：**

- 不实现任何业务/状态机逻辑（按钮 disabled 态、Select 高亮规则、Modal 焦点 trap 算法等均在 `@xui/shared`）
- 不定义 Props 契约（`ButtonProps` / `SelectProps` / `TabsProps` / `MessageOptions` 等类型来自 `@xui/core`）
- 不维护样式（`packages/styles` 是组件样式唯一来源）
- 不维护图标资源（`@xui/icons` 提供 `icons.loading` / `icons.close` / `icons.clear` 等原始 SVG 字符串）

## 依赖关系

| 依赖 | 角色 |
| --- | --- |
| `@xui/core` | 类型契约来源（`ButtonProps`、`SelectProps`、`ModalProps`、`TabsProps`、`TabItem`、`MessageOptions`、`MessageHandle` 等） |
| `@xui/shared` | 纯逻辑实例（`createButtonLogic` / `createModalLogic` / `createSelectLogic` / `createTabsLogic` 等）+ 主题 / 国际化运行时 + 虚拟滚动原语 + 浮动定位工具 + `StateListener` / `Unsubscribe` 类型 |
| `@xui/styles` | 组件样式单一来源，`import '@xui/styles'` 即获得全部样式 |
| `@xui/icons` | 内联 SVG 图标数据（`icons.loading`、`icons.close`、`icons.clear`、`icons['arrow-down']` 等） |
| `react` / `react-dom` | peerDependency `>=19.0.0`（依赖 `useSyncExternalStore`、`useId`、ref-as-prop 等 19 API）；均为必选（`optional: false`） |

> 开发依赖 `clsx` 仅用于测试参照，运行时 className 合并由本包自带 `cn`（`src/utils/cn.ts`）实现，**不依赖任何外部 className 库**。

## 完整导出清单

> 以下导出均来自 `src/index.ts`，按用途分组。

### 组件（函数组件）

| 组件 | 导出名 | 配套类型 | 源文件 |
| --- | --- | --- | --- |
| 按钮 | `Button` | `ButtonComponentProps`、`ButtonRef` | `components/button/Button.tsx` |
| 输入框 | `Input` | `InputComponentProps`、`InputRef` | `components/input/Input.tsx` |
| 开关 | `Switch` | `SwitchComponentProps`、`SwitchRef` | `components/switch/Switch.tsx` |
| 复选框 | `Checkbox` | `CheckboxComponentProps`、`CheckboxRef` | `components/checkbox/Checkbox.tsx` |
| 标签 | `Tag` | `TagComponentProps` | `components/tag/Tag.tsx` |
| 警告提示 | `Alert` | `AlertComponentProps` | `components/alert/Alert.tsx` |
| 单选组 | `RadioGroup` | `RadioGroupComponentProps` | `components/radio-group/RadioGroup.tsx` |
| 单选项 | `Radio` | `RadioComponentProps` | `components/radio/Radio.tsx` |
| 进度条 | `Progress` | `ProgressComponentProps` | `components/progress/Progress.tsx` |
| 徽标 | `Badge` | `BadgeComponentProps` | `components/badge/Badge.tsx` |
| 头像 | `Avatar` | `AvatarComponentProps` | `components/avatar/Avatar.tsx` |
| 空状态 | `Empty` | `EmptyComponentProps` | `components/empty/Empty.tsx` |
| 下拉选择 | `Select` | `SelectComponentProps` | `components/select/Select.tsx` |
| 标签页 | `Tabs` | `TabsComponentProps` | `components/tabs/Tabs.tsx` |
| 文字提示 | `Tooltip` | `TooltipComponentProps` | `components/tooltip/Tooltip.tsx` |
| 分页 | `Pagination` | `PaginationComponentProps` | `components/pagination/Pagination.tsx` |
| 日期选择 | `DatePicker` | `DatePickerComponentProps` | `components/date-picker/DatePicker.tsx` |
| 表格 | `Table` | `TableComponentProps` | `components/table/Table.tsx` |
| 加载 | `Spin` | `SpinComponentProps` | `components/spin/Spin.tsx` |
| 面包屑 | `Breadcrumb` | `BreadcrumbComponentProps` | `components/breadcrumb/Breadcrumb.tsx` |
| 骨架屏 | `Skeleton` | `SkeletonComponentProps` | `components/skeleton/Skeleton.tsx` |
| 数字输入 | `InputNumber` | `InputNumberComponentProps` | `components/input-number/InputNumber.tsx` |
| 气泡确认 | `Popconfirm` | `PopconfirmComponentProps` | `components/popconfirm/Popconfirm.tsx` |
| 弹窗 | `Modal` | `ModalComponentProps`、`ModalRef` | `components/modal/Modal.tsx` |
| 全局提示（命令式） | `message` | （`MessageShortcutOptions`，随 message 对象使用） | `components/message/message.ts`（其上挂 `info/success/warning/error/open/closeAll`） |

> `message/index.ts` 另导出独立函数 `open` 与类型 `MessageShortcutOptions`，但包入口 `index.ts` 仅 re-export `message` 对象（其 `.open` 方法可达）。`MessageHost.tsx` 是命令式 message 的挂载容器，不对外导出。

### Hooks

| Hook | 来源 | 用途 |
| --- | --- | --- |
| `useLogicState` | `src/hooks/use-logic-state.ts` | 把 `@xui/shared` 逻辑实例状态桥接到 React：内部用 ref 缓存最新快照 + `useSyncExternalStore` 订阅，**保证 getSnapshot 引用稳定**，避免无限重渲染 |
| `useLocaleData` | `src/hooks/use-locale.ts` | 订阅当前语言包，返回 `XuiLocaleData`；复用 `useLogicState` 基座，语言切换 / 当前包重新注册时自动重渲染 |

### 工具

| 工具 | 来源 | 用途 |
| --- | --- | --- |
| `cn` | `src/utils/cn.ts` | 框架无关的 className 拼接：支持 string/number、对象（键值为真取键名）、数组（递归展开），自动跳过 `false`/`null`/`undefined`。不依赖 clsx 等外部库 |

### 主题运行时 API（re-export 自 `@xui/shared`）

- 函数：`clearThemeTokens`、`getTheme`、`setTheme`、`setThemeTokens`、`subscribeTheme`、`toggleTheme`、`applyPlugins`、`createVirtualListLogic`
- 类型：`XuiTheme`、`XuiPlugin`、`PluginInstallContext`、`VirtualListLogicInstance`、`VirtualListOptions`、`VirtualListState`

### 国际化运行时 API（re-export 自 `@xui/shared`）

- 函数：`DEFAULT_LOCALE`、`getLocale`、`getLocaleData`、`registerLocale`、`setLocale`、`subscribeLocale`
- 类型：`LocaleListener`、`XuiLocaleData`、`XuiLocaleInput`

### 常量

- `REACT_VERSION`：适配层版本占位常量。

## 适配模式说明

### 1. `useSyncExternalStore` + 快照缓存模式（核心，否则无限重渲染）

`@xui/shared` 的逻辑实例 `logic.getState()` 每次返回**新的对象引用**（浅拷贝）。若直接把它作为 `useSyncExternalStore` 的 `getSnapshot`，React 会在每次渲染时调用 `getSnapshot`，`Object.is(prev, next)` 比较恒为 `false`，触发无限重渲染。

`useLogicState` 通过 ref 缓存最新快照解决此问题：

```ts
export function useLogicState<S extends object>(
  subscribe: (listener: StateListener<S>) => Unsubscribe,
  getState: () => S,
): S {
  const cachedRef = useRef<S | null>(null);
  if (cachedRef.current === null) {
    cachedRef.current = getState();           // 首次取一次
  }
  const wrappedSubscribe = useCallback((onStoreChange) => {
    return subscribe((next) => {
      cachedRef.current = next;               // 通知时更新缓存
      onStoreChange();                        // 触发 React 重渲染
    });
  }, [subscribe]);
  const getSnapshot = useCallback(() => cachedRef.current as S, []);  // 引用稳定
  return useSyncExternalStore(wrappedSubscribe, getSnapshot, getSnapshot);
}
```

组件侧用法统一为：

```ts
const state = useLogicState(logic.subscribe, logic.getState);
```

`useLocaleData` 同样复用该基座：`getLocaleData()` 返回稳定引用，仅在语言切换时更换。

### 2. 逻辑实例只创建一次（`useRef` 懒初始化）

每个组件用 `useRef` + `if (ref.current === null)` 保证逻辑实例在组件全生命周期只创建一次，避免每次渲染重建订阅：

```ts
const logicRef = useRef<SelectLogicInstance | null>(null);
if (logicRef.current === null) {
  logicRef.current = createSelectLogic({ value, defaultValue, options, ... });
}
const logic = logicRef.current;
```

prop 变更通过 `useEffect` → `logic.updateOptions` 同步，而非重建实例。

### 3. 回调 latest-ref 模式（隔离回调依赖，避免受控回退竞态）

React 组件中回调函数引用每次渲染都是新的（App 每次重渲染都会新建箭头函数）。若把 `onChange` / `onOk` 等回调放进 `updateOptions` 的 `useEffect` 依赖数组，回调引用变化会触发 effect 重跑，导致命令式 `open()` 后的任意重渲染用受控旧值把 `visible` 打回 `false`（受控回退竞态）。

修复模式：回调统一经 `callbacksRef` 间接调用，`updateOptions` 的 effect 依赖**只列状态类 props**：

```ts
const callbacksRef = useRef({ onChange, onClear });
callbacksRef.current = { onChange, onClear };          // 每次渲染刷新最新引用

logicRef.current = createSelectLogic({
  ...,
  onChange: (v) => callbacksRef.current.onChange?.(v),  // 闭包转发，永不进入依赖
  onClear: () => callbacksRef.current.onClear?.(),
});

useEffect(() => {
  logic.updateOptions({ value, options, disabled, clearable, multiple, searchable });
}, [logic, value, options, disabled, clearable, multiple, searchable]);  // 不含回调
```

Button 是例外：`onClick` 直接进 `updateOptions` 依赖（Button 无受控状态，回调竞态无危害）。

### 4. `renderXxx` 渲染回调对应 Vue 具名插槽

React 用 `renderXxx` 渲染回调对外暴露自定义渲染位，与 Vue 适配层的具名插槽一一对应：

| React 渲染回调 | Vue 具名插槽 | 出现组件 |
| --- | --- | --- |
| `renderIcon` / `renderLoadingIcon` | `#icon` / `#loadingIcon` | Button |
| `renderTitle` / `renderFooter` / `renderCloseIcon` | `#title` / `#footer` / `#closeIcon` | Modal |
| `renderClearIcon` / `renderSuffixIcon` | `#clearIcon` / `#suffixIcon` | Select |
| `renderPanel(item)` | default 作用域插槽 `#default="{ item }"` | Tabs |

组件 Props 类型在契约 Props 基础上扩展 React 专属属性：

```ts
export type ButtonComponentProps = ButtonProps & {
  children?: ReactNode;
  renderIcon?: () => ReactNode;
  renderLoadingIcon?: () => ReactNode;
  ref?: Ref<ButtonRef>;     // React 19 ref-as-prop
};
```

### 5. `useLocaleData` 用途

组件中需要取全局语言包文案时（如 Modal 的默认 ok/cancel 文案、Select 的 placeholder / 搜索框 aria），调用 `useLocaleData()` 拿到当前语言包对象，实现“未传 prop 时回退到全局文案”：

```ts
const locale = useLocaleData();
// ...
{okText ?? locale.modal.ok}
{placeholder ?? locale.select.triggerPlaceholder}
```

`setLocale` / `registerLocale` 后语言包变更会自动驱动依赖该值的重渲染。

### 6. ref-as-prop + `useImperativeHandle` 暴露命令式 API

React 19 支持 ref 作为普通 prop 传入（无需 `forwardRef`）。组件通过 `useImperativeHandle` 把命令式 API 暴露到 ref，与 Vue 端 `defineExpose` 对齐：

```ts
export interface ButtonRef {
  focus: () => void;
  setLoading: (loading: boolean) => void;
}

useImperativeHandle(
  ref,
  () => ({
    focus: () => buttonRef.current?.focus(),
    setLoading: (next) => logic.updateOptions({ loading: next }),
  }),
  [logic],   // 仅依赖 logic 实例（稳定引用），依赖数组用 [logic]
);
```

Modal 的 `ModalRef` 暴露 `open` / `close`，与 Vue `defineExpose({ open, close })` 对齐。

### 7. `cn` 合并 className

根元素 className 用 `cn` 合并组件内置类名与外部透传：

```tsx
<div className={cn('xui-select', className, multiple && 'is-multiple', {
  'is-disabled': state.disabled,
  'is-open': state.open,
})} style={style as CSSProperties}>
```

### 8. 自定义透传约定

除命令式 `message` 外，所有声明式组件根元素统一支持 `className` / `style` props 透传，React 端用 `cn()` 合并、`style` 直接展开。

## 使用示例

### 按需引入

```tsx
import { useRef } from 'react';
import { Button, Modal, Select, message } from '@xui/react';
import type { ButtonRef, ModalRef } from '@xui/react';
import '@xui/styles';   // 一次性引入全部组件样式

const options = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
];

export function Demo() {
  const [city, setCity] = useState('hangzhou');
  const modalRef = useRef<ModalRef>(null);

  function onConfirm() {
    message.success(`已选择 ${city}`);
    modalRef.current?.close();
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Select value={city} options={options} onChange={setCity} placeholder="请选择城市" />
      <Button type="primary" onClick={() => modalRef.current?.open()}>打开弹窗</Button>
      <Modal ref={modalRef} title="确认选择" onOk={onConfirm}>
        <p>当前选择：{city}</p>
        <Button type="primary" onClick={onConfirm}>确定</Button>
      </Modal>
    </div>
  );
}
```

### 自定义渲染回调（对应 Vue 具名插槽）

```tsx
import { Modal } from '@xui/react';

<Modal
  visible={visible}
  onOk={handleOk}
  renderTitle={() => <strong>自定义标题</strong>}
  renderFooter={() => (
    <>
      <button onClick={() => setVisible(false)}>取消</button>
      <button onClick={handleOk}>确定</button>
    </>
  )}
>
  内容
</Modal>
```

## 关键避坑点

1. **适配层 tsconfig paths 必须指向兄弟包的 `dist/types` 目录**，指向 `src` 会触发 TS6059 错误（文件不在 rootDir 内）。这是 monorepo 类型解析的硬约束。

2. **必须使用快照缓存的 `useSyncExternalStore` 模式**（即 `useLogicState`）。直接把 `logic.getState()` 作 `getSnapshot` 会因每次返回新对象引用、`Object.is` 比较恒失败，触发**无限重渲染**。所有逻辑状态订阅必须走 `useLogicState`，不要手写 `useState` + `useEffect` 订阅替代。

3. **回调引用更新会触发 `useEffect` 重跑，导致受控状态回退竞态**。`onChange` / `onOk` / `onOpen` 等回调必须经 `callbacksRef` 间接调用（latest-ref 模式），`updateOptions` 的 effect 依赖数组只列状态类 props，不含回调。Button 是例外（无受控状态，`onClick` 可直接进依赖）。

4. **契约类型（`TableColumn` / `BreadcrumbItem` / `TabItem` / `SelectOption` 等）统一从 `@xui/core` 导入**，`@xui/react` 只 re-export 适配层自身的 props 类型（`XxxComponentProps` / `XxxRef`），不重新定义契约类型。`XxxComponentProps` = 契约 Props `&` React 专属属性（`children` / `renderXxx` / `ref`）。

5. **`useImperativeHandle` 工厂仅引用 `logic`（稳定引用）时依赖数组用 `[logic]`**。注意 `eslint-plugin-react-hooks@4.6.0` 与 ESLint 9 不兼容，工厂内即使引用了 `buttonRef` 也不必把它加入依赖（ref 对象引用稳定）。

6. **Tabs `renderPanel` 回调对应 Vue 作用域插槽 default**（参数为当前激活项），不是 Vue 的具名 `#item` 插槽（Vue 端具名 `#item` 不会被消费）。

7. **逻辑实例必须用 `useRef` + `if (ref.current === null)` 懒初始化**，保证组件全生命周期只创建一次；prop 变更走 `useEffect` → `logic.updateOptions`，不要重建实例。

8. **自定义透传约定**：除命令式 `message` 外全部声明式组件根元素统一支持 `className` / `style` props；React 端用 `cn()` 合并 className、`style` 直接展开。`cn` 不依赖 clsx，由 `src/utils/cn.ts` 自实现。

9. **命令式 `message` 首次调用时自动挂载全局容器**（`manager.tsx`），无需手动挂载 `<MessageHost>`；`message` 对象上挂 `info/success/warning/error/open/closeAll`，`closeAll` 关闭全部。

10. **React 19 ref-as-prop**：ref 作为普通 prop 传入（`ref?: Ref<XxxRef>`），无需 `forwardRef`；peerDependency 要求 `react` / `react-dom` 均 `>=19.0.0` 且为必选。
