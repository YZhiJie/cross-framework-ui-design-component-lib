# @xui-design/vue

跨框架组件库的 **Vue 3 适配层**：将 `@xui-design/shared` 的框架无关核心逻辑桥接到 Vue 3.5+ 的响应式系统，对外暴露一组与 React 适配层行为对齐的声明式 SFC 组件。

> 类型契约来自 `@xui-design/core`，纯逻辑来自 `@xui-design/shared`，样式来自 `@xui-design/styles`，图标来自 `@xui-design/icons`。本包不重复实现任何核心逻辑。

## 职责边界

**适配层做什么：**

- 用 `<script setup>` 把核心层（`createXxxLogic`）的状态接到 Vue 响应式系统：`ref(logic.getState())` + `logic.subscribe` 订阅 + `onUnmounted` 退订
- 把 Vue 的事件 / `v-model` / 插槽翻译成核心层的回调契约
- 通过 `watchEffect` 把响应式 props 同步到 `logic.updateOptions`，保证受控模式 value 变更可达
- 处理 DOM 绑定、ARIA 属性、键盘交互、Teleport、虚拟滚动等渲染细节

**适配层不做什么：**

- 不实现任何业务/状态机逻辑（按钮 disabled 态、Select 高亮规则、Modal 焦点 trap 算法等均在 `@xui-design/shared`）
- 不定义 Props 契约（`ButtonProps` / `SelectProps` / `TabsProps` 等类型来自 `@xui-design/core`）
- 不维护样式（`packages/styles` 是组件样式唯一来源，SFC 内仅 Button 保留内联样式作历史示例）
- 不维护图标资源（`@xui-design/icons` 提供 `icons.loading` / `icons.close` / `icons.clear` 等原始 SVG 字符串）

## 依赖关系

| 依赖 | 角色 |
| --- | --- |
| `@xui-design/core` | 类型契约来源（`ButtonProps`、`SelectProps`、`ModalProps`、`TabsProps`、`MessageOptions`、`MessageHandle`、`SelectValue` 等） |
| `@xui-design/shared` | 纯逻辑实例（`createButtonLogic` / `createModalLogic` / `createSelectLogic` / `createTabsLogic` / `createInputLogic` 等）+ 主题 / 国际化运行时 + 虚拟滚动原语 + 浮动定位工具 |
| `@xui-design/styles` | 组件样式单一来源，`import '@xui-design/styles'` 即获得全部样式 |
| `@xui-design/icons` | 内联 SVG 图标数据（`icons.loading`、`icons.close`、`icons.clear`、`icons['arrow-down']` 等） |
| `vue` | peerDependency `>=3.5.0`（依赖 `defineModel`、`useId`、`useTemplateRef` 等 3.5 API） |

## 完整导出清单

> 以下导出均来自 `src/index.ts`，按用途分组。

### 组件（SFC）

| 组件 | 导出名 | 源文件 |
| --- | --- | --- |
| 按钮 | `Button` | `components/button/Button.vue` |
| 输入框 | `Input` | `components/input/Input.vue` |
| 开关 | `Switch` | `components/switch/Switch.vue` |
| 复选框 | `Checkbox` | `components/checkbox/Checkbox.vue` |
| 标签 | `Tag` | `components/tag/Tag.vue` |
| 警告提示 | `Alert` | `components/alert/Alert.vue` |
| 单选组 | `RadioGroup` | `components/radio-group/RadioGroup.vue` |
| 单选项 | `Radio` | `components/radio/Radio.vue` |
| 进度条 | `Progress` | `components/progress/Progress.vue` |
| 徽标 | `Badge` | `components/badge/Badge.vue` |
| 头像 | `Avatar` | `components/avatar/Avatar.vue` |
| 空状态 | `Empty` | `components/empty/Empty.vue` |
| 下拉选择 | `Select` | `components/select/Select.vue` |
| 标签页 | `Tabs` | `components/tabs/Tabs.vue` |
| 文字提示 | `Tooltip` | `components/tooltip/Tooltip.vue` |
| 分页 | `Pagination` | `components/pagination/Pagination.vue` |
| 日期选择 | `DatePicker` | `components/date-picker/DatePicker.vue` |
| 表格 | `Table` | `components/table/Table.vue` |
| 加载 | `Spin` | `components/spin/Spin.vue` |
| 面包屑 | `Breadcrumb` | `components/breadcrumb/Breadcrumb.vue` |
| 骨架屏 | `Skeleton` | `components/skeleton/Skeleton.vue` |
| 数字输入 | `InputNumber` | `components/input-number/InputNumber.vue` |
| 气泡确认 | `Popconfirm` | `components/popconfirm/Popconfirm.vue` |
| 弹窗 | `Modal` | `components/modal/Modal.vue` |
| 全局提示（命令式） | `message` | `components/message/message.ts`（其上挂 `info/success/warning/error/open/closeAll`） |

> 注意：`message/index.ts` 另导出独立函数 `open` 与类型 `MessageShortcutOptions`，但包入口 `index.ts` 仅 re-export `message` 对象（其 `.open` 方法可达）。`MessageHost.vue` 是命令式 message 的挂载容器，不对外导出。

### Hooks

| Hook | 来源 | 用途 |
| --- | --- | --- |
| `useLocaleData` | `src/hooks/use-locale.ts` | 订阅当前语言包，返回响应式 `Ref<XuiLocaleData>`；语言切换（`setLocale` / `registerLocale`）后自动更新，驱动依赖它的 `computed` / 模板重渲染 |

> Vue 适配层**没有** `useLogicState` 这个统一 hook。每个 SFC 内部直接采用 `const state = ref(logic.getState())` + `logic.subscribe((next) => { state.value = next })` + `onUnmounted(unsubscribe)` 的固定三段式订阅核心状态。

### 主题运行时 API（re-export 自 `@xui-design/shared`）

- 函数：`clearThemeTokens`、`getTheme`、`setTheme`、`setThemeTokens`、`subscribeTheme`、`toggleTheme`、`applyPlugins`、`createVirtualListLogic`
- 类型：`XuiTheme`、`XuiPlugin`、`PluginInstallContext`、`VirtualListLogicInstance`、`VirtualListOptions`、`VirtualListState`

### 国际化运行时 API（re-export 自 `@xui-design/shared`）

- 函数：`DEFAULT_LOCALE`、`getLocale`、`getLocaleData`、`registerLocale`、`setLocale`、`subscribeLocale`
- 类型：`LocaleListener`、`XuiLocaleData`、`XuiLocaleInput`

### 默认导出（Vue 插件）

默认导出一个带 `install(app: App)` 的对象，可一次性全局注册 24 个声明式组件（不含命令式 `message`）：

```ts
import XuiVue from '@xui-design/vue';
const app = createApp(App);
app.use(XuiVue);
```

> 常量 `VUE_VERSION` 也会被导出。

## 适配模式说明

### 1. Props 写法：`withDefaults` 与响应式解构的取舍

Vue 适配层存在两种 props 处理模式，**取舍取决于是否需要默认值进 props 选项**：

**模式 A —— 直接 `defineProps<T>()` + 解构（响应式解构）**
代表组件：`Button.vue`、`Input.vue`、`Modal.vue`。这些组件不需要把默认值编译进 props 选项（默认值靠解构赋值），直接：

```ts
const { type = 'default', size = 'md', disabled = false } =
  defineProps<Omit<ButtonProps, 'onClick'>>();
```

此写法下解构变量是**响应式**的，可直接进 `watchEffect` 依赖收集、模板也响应式更新。

**模式 B —— `withDefaults(defineProps<T>(), {...})` + 不解构 / 仅初始化时解构**
代表组件：`Select.vue`、`Tabs.vue`。这些组件需要把默认值（如 `value: undefined`、`maxHeight: 264`）编译进 props 选项（供非受控模式判断、虚拟滚动视口计算等），必须用 `withDefaults` 第二参数显式声明：

```ts
const props = withDefaults(defineProps<Omit<SelectProps, 'onChange' | 'onClear'>>(), {
  value: undefined,      // 未绑定 value 保持 undefined → 逻辑层进入非受控模式
  defaultValue: undefined,
  disabled: false,
  clearable: false,
  multiple: false,
  searchable: false,
  virtual: false,
  maxHeight: 264,
  className: undefined,
  style: undefined,
});
```

⚠️ **关键避坑**：`withDefaults(defineProps<T>(), {...})` 的返回值**一旦解构**会禁用 Vue 3.5 的响应式解构，解构变量退化为一次性快照，`watchEffect` 依赖收集失效。因此 Select/Tabs 采用：

```ts
const { value, defaultValue, options } = props;  // 仅用于 setup 一次性初始化逻辑层
watchEffect(() => {
  logic.updateOptions({ value: props.value, options: props.options });  // 一律 props.xxx
});
```

即**解构快照只用于逻辑层初始化，后续同步与模板一律 `props.xxx` 响应式访问**。而模式 A 的 `const { x } = defineProps<T>()`（无 `withDefaults`）是响应式解构，可正常使用。

### 2. defineEmits 必须用元组形式

所有 SFC 的 `defineEmits` 一律使用元组形式声明载荷类型，避免对象形式导致的类型推断偏差：

```ts
const emit = defineEmits<{ click: [event: MouseEvent] }>();
// Modal.vue 多事件：
const emit = defineEmits<{ open: []; close: []; ok: []; cancel: [] }>();
// Select.vue 带 v-model：
const emit = defineEmits<{
  change: [value: SelectValue];
  clear: [];
  'update:value': [value: SelectValue];
}>();
```

### 3. Props 类型从 core 导入时用 Omit 过滤回调字段

`@xui-design/core` 的契约 Props（如 `ButtonProps`、`ModalProps`、`SelectProps`）同时包含状态字段与 `onXxx` 回调字段。Vue 端**不能**直接把含 `onXxx` 的完整 Props 类型喂给 `defineProps`——否则回调会被编译进 props 选项，导致回调被当作 prop 处理。必须用 `Omit` 剔除回调字段，回调改由 `defineEmits` 表达：

```ts
// Button.vue：剔除 onClick
defineProps<Omit<ButtonProps, 'onClick'>>();
// Input.vue：剔除所有回调 + value/defaultValue（用 v-model 表达）
defineProps<Omit<InputProps, 'value' | 'defaultValue' | 'onInput' | 'onChange' | 'onFocus' | 'onBlur' | 'onClear'>>();
// Modal.vue：剔除 visible/defaultVisible（用 defineModel 表达）+ 所有回调
defineProps<Omit<ModalProps, 'visible' | 'defaultVisible' | 'onOpen' | 'onClose' | 'onOk' | 'onCancel'>>();
```

### 4. 插槽映射（具名插槽 → React `renderXxx`）

Vue 用具名插槽对外暴露自定义渲染位，与 React 适配层的 `renderXxx` 回调一一对应：

| Vue 具名插槽 | React 渲染回调 | 出现组件 |
| --- | --- | --- |
| `#icon` / `#loadingIcon` | `renderIcon` / `renderLoadingIcon` | Button |
| `#title` / `#footer` / `#closeIcon` | `renderTitle` / `renderFooter` / `renderCloseIcon` | Modal |
| `#clearIcon` / `#suffixIcon` | `renderClearIcon` / `renderSuffixIcon` | Select |
| default 作用域插槽 `#default="{ item }"` | `renderPanel(item)` | Tabs |

⚠️ **Tabs 面板插槽**：Vue Tabs 的面板作用域插槽是 **default 插槽**（`<slot :item="activeItem">`），具名 `#item` **不会被消费**；React 端对应 `renderPanel` 回调，参数为当前激活项。

### 5. `v-model` 双向绑定

涉及值双向绑定的组件（Input 的 `value`、Modal 的 `visible`）用 `defineModel`：

```ts
const modelValue = defineModel<string>('value', { default: '' });   // Input.vue
const visible = defineModel<boolean>('visible', { default: false }); // Modal.vue
```

Select/Tabs 的值变更通过 `emit('update:value', val)` 手动触发 v-model，配合 `emit('change', val)` 提供语义事件。

### 6. `useLocaleData` 用途

SFC 中需要取全局语言包文案时（如 Modal 的默认 ok/cancel 文案、Select 的 placeholder），调用 `useLocaleData()` 拿到响应式 `Ref<XuiLocaleData>`，配合 `computed` 实现“未传 prop 时回退到全局文案”：

```ts
const locale = useLocaleData();
const okLabel = computed(() => okText ?? locale.value.modal.ok);
```

`setLocale` / `registerLocale` 后语言包变更会自动驱动依赖该 ref 的 computed 与模板重渲染。在 setup 作用域内调用会随组件销毁自动退订。

### 7. 自定义透传约定

除命令式 `message` 外，所有声明式组件的根元素统一支持 `className` / `style` props 透传（Vue 端模板按名 `className` / `style` 直接绑定即可，无需改 script）：

```vue
<div ref="root" class="xui-select" :class="rootClass" :style="rootStyle">
```

## 使用示例

### 全量引入 + 按需使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal, Select, message } from '@xui-design/vue';
import '@xui-design/styles';   // 一次性引入全部组件样式

const visible = ref(false);
const city = ref<string>('hangzhou');

const options = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
];

function onConfirm() {
  message.success(`已选择 ${city.value}`);
  visible.value = false;
}
</script>

<template>
  <div style="display:flex;gap:12px;align-items:center;">
    <Select v-model:value="city" :options="options" placeholder="请选择城市" />
    <Button type="primary" @click="visible = true">打开弹窗</Button>
    <Modal v-model:visible="visible" title="确认选择" @ok="onConfirm">
      <p>当前选择：{{ city }}</p>
      <template #footer>
        <Button @click="visible = false">取消</Button>
        <Button type="primary" @click="onConfirm">确定</Button>
      </template>
    </Modal>
  </div>
</template>
```

### 全局插件注册（可选）

```ts
import { createApp } from 'vue';
import XuiVue from '@xui-design/vue';
import '@xui-design/styles';
import App from './App.vue';

createApp(App).use(XuiVue).mount('#app');
```

## 关键避坑点

1. **适配层 tsconfig paths 必须指向兄弟包的 `dist/types` 目录**，指向 `src` 会触发 TS6059 错误（文件不在 rootDir 内）。这是 monorepo 类型解析的硬约束。

2. **`withDefaults(defineProps<T>(), {...})` 返回值禁止解构后用于响应式依赖**。解构会禁用 Vue 3.5 响应式解构，变量退化为一次性快照，`watchEffect` 依赖收集失效。正确做法：`const props = withDefaults(...)`，解构快照仅用于逻辑层初始化，`watchEffect` 与模板一律 `props.xxx`。而直接 `const { x } = defineProps<T>()`（无 `withDefaults`）是响应式解构可正常使用。

3. **`defineEmits` 必须用元组形式**（`{ click: [event: MouseEvent] }`），对象形式会导致类型推断偏差。

4. **Props 类型从 core 导入时必须 `Omit<XxxProps, 'onXxx'>`** 剔除回调字段，否则 `defineProps` 直接引用含 `onXxx` 回调的完整 Props 类型会把回调编译进 props 选项。

5. **SFC 默认值必须写在 `withDefaults` 第二参数**才会编译进 props 选项；写在解构默认值（`const { x = 1 } = defineProps<T>()`）不会进 props 选项，非受控模式判断拿不到。

6. **契约类型（`TableColumn` / `BreadcrumbItem` / `TabItem` / `SelectOption` 等）统一从 `@xui-design/core` 导入**，Vue 适配层不重新定义契约类型，只 re-export 适配层自身的 props 类型（如 `MessageShortcutOptions`）。

7. **Vue Tabs 面板作用域插槽是 default 插槽**（`#default="{ item }"`），具名 `#item` 不会被消费；React 端对应 `renderPanel` 回调。

8. **自定义透传约定**：除命令式 `message` 外全部声明式组件根元素统一支持 `className` / `style` props；Vue 端 props 在模板按名可直接绑定，无需改 script。

9. **命令式 `message` 首次调用时自动挂载全局容器**（`manager.ts`），无需手动挂载 `<MessageHost>`；`message` 对象上挂 `info/success/warning/error/open/closeAll`，`closeAll` 关闭全部。
