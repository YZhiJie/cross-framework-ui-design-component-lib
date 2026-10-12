# @xui/shared/locale

国际化运行时核心（框架无关），为 Vue 3 / React 19 双端组件库提供统一的语言包注册、切换与订阅能力。

## 职责边界

- **纯逻辑、纯内存**：模块级 `Map` 注册表 + `currentKey/cache` 状态，不读写 DOM、不依赖 `window`，SSR 下同样生效。
- **框架无关**：不引入 Vue / React，导出函数 + 类型供任意适配层桥接。
- **稳定引用语义**：`getLocaleData()` 恒返回缓存引用（仅语言切换 / 当前包重新注册时重建），满足 React `useSyncExternalStore` 的快照一致性要求。
- **零行为变化默认**：未调用 `setLocale` 时默认 `zh-CN`，且内置 `zh-CN` 文案与历史硬编码逐字一致，升级前后无视觉差异。

## 导出 API 清单（index.ts）

| 导出 | 签名 | 说明 |
| --- | --- | --- |
| `DEFAULT_LOCALE` | `const DEFAULT_LOCALE = 'zh-CN'` | 默认语言标识，与历史硬编码文案一致 |
| `getLocale` | `function getLocale(): string` | 读取当前语言标识 |
| `getLocaleData` | `function getLocaleData(): XuiLocaleData` | 读取当前生效语言包（稳定引用） |
| `registerLocale` | `function registerLocale(key: string, partial: XuiLocaleInput): void` | 注册 / 覆盖语言包：以既有注册（新语言回退当前生效包）为基底做组级浅合并 |
| `setLocale` | `function setLocale(key: string): void` | 切换语言：未注册的 key 静默忽略；与当前相同或语言包未变化时静默返回 |
| `subscribeLocale` | `function subscribeLocale(listener: LocaleListener): () => void` | 订阅语言包变更，返回取消订阅函数 |
| `zhCN` | `const zhCN: XuiLocaleData` | 内置简体中文语言包（默认） |
| `enUS` | `const enUS: XuiLocaleData` | 内置英文（US）语言包 |
| `XuiLocaleData` | `type` | 组件库语言包结构（按组件分组） |
| `XuiLocaleInput` | `type` | `registerLocale` 输入，允许只提供部分组 / 部分字段 |
| `LocaleListener` | `type` | 语言包变更监听器 |

## 关键类型定义

### `XuiLocaleData`

按组件分组组织用户可见文案，内置覆盖 8 个组件：Modal / Popconfirm / Table / Pagination / DatePicker / Skeleton / Breadcrumb / Select。

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

### `XuiLocaleInput`

```ts
export type XuiLocaleInput = { [K in keyof XuiLocaleData]?: Partial<XuiLocaleData[K]> };
```

允许只传部分组、组内只传部分字段，未提供字段回退基底语言包。注意 `datePicker.weekdays` 是整体替换、不做逐项合并。

### `LocaleListener`

```ts
export type LocaleListener = (data: XuiLocaleData) => void;
```

收到切换 / 重新注册后的完整语言包（稳定引用）。

## 工作机制

### 默认与内置语言包

- 模块加载即注册 `zh-CN`、`en-US` 两个内置包，`currentKey` 初始为 `DEFAULT_LOCALE`（`'zh-CN'`），`cache` 直接复用 `zhCN` 引用。
- `zhCN` 文案与历史硬编码默认值逐字一致（如 `modal.ok = '确认'`、`popconfirm.confirm = '确定'`、`table.empty = '暂无数据'`、`pagination.prev = '上一页'`、`datePicker.placeholder = '请选择日期'`、`select.triggerPlaceholder = '请选择'`、`breadcrumb.nav = '面包屑'`、`skeleton.loading = '加载中'`）；`weekdays` 复用 `create-date-picker-logic` 的 `DATE_WEEKDAY_LABELS = ['日','一','二','三','四','五','六']`。
- `enUS` 中 `datePicker.placeholder` 为 `'Select date'`（注意：不是 `'Select a date'`）；`titleFormat` 使用英文月份名（`January` … `December`），`weekdays` 为 `['Su','Mo','Tu','We','Th','Fr','Sa']`。

### setLocale

- 从 `packs` 取目标 key；key 不存在或与 `currentKey` 相同时静默返回，不重建缓存、不通知，保证引用稳定。
- 命中后更新 `currentKey` / `cache`，调用 `notify()` 把新 `cache` 推送给所有监听器。

### registerLocale（组级浅合并）

- 非法入参静默忽略：`key` 非字符串或空串、`partial` 为 `null` / 非对象直接返回；任一组的值非对象时该组跳过。
- 基底选择：`packs.get(key) ?? cache`——新语言回退当前生效包，已有语言则在原包基础上追加 / 覆盖。
- 合并粒度为**组级浅合并**：`target[group] = { ...source[group], ...patch }`，未提及字段继承基底；`weekdays` 等数组字段整体替换。
- 无有效变更（`partial` 中没有任何对象组）时不重建引用、不通知，保持稳定引用语义。
- 注册的 key 即当前生效语言时重建 `cache` 并 `notify()`；否则仅更新 `packs` 注册表。

### subscribeLocale

- 基于 `Set<LocaleListener>`，返回的取消订阅函数会把对应 listener 从集合中删除。

### 显式 prop 优先

组件库约定：文案类默认值（`okText` / `confirmText` / `cancelText` / `placeholder` 等）一律不写硬编码默认值，spec 与双端实现保持 `undefined`，渲染时通过 `prop ?? locale` 回退到语言包。因此显式 prop 永远优先于语言包文案。

## 使用示例

```ts
import {
  DEFAULT_LOCALE,
  getLocale,
  getLocaleData,
  registerLocale,
  setLocale,
  subscribeLocale,
} from '@xui/shared/locale';

// 1) 读取默认语言
getLocale(); // 'zh-CN'
getLocaleData().modal.ok; // '确认'

// 2) 切换到英文
setLocale('en-US');
getLocaleData().modal.ok; // 'OK'
getLocaleData().datePicker.placeholder; // 'Select date'

// 3) 覆盖中文 Modal 文案，未提及字段继承基底
registerLocale('zh-CN', { modal: { ok: '好的' } });
getLocaleData().modal; // { ok: '好的', cancel: '取消' }

// 4) 新增日文（回退当前生效包）
registerLocale('ja-JP', {
  modal: { ok: 'OK' },
  table: { empty: 'データなし' },
});
setLocale('ja-JP');

// 5) 订阅语言切换
const unsubscribe = subscribeLocale((data) => {
  console.log('locale changed', data.modal.ok);
});
unsubscribe(); // 取消订阅
```

## 双端接入方式

适配层把 `subscribeLocale` + `getLocaleData` 桥接到各框架的响应式系统：

- **Vue 3（`useLocaleData`）**：在 `useLocaleData` 内部调用 `subscribeLocale`，收到新语言包后通过 `ref` / `reactive` 触发模板重渲染；返回响应式引用，模板直接 `locale.modal.ok` 消费。Vue 的响应式追踪天然兼容稳定引用，无需额外快照缓存。
- **React 19（`useLocaleData`）**：使用 `useSyncExternalStore(subscribeLocale, getLocaleData, getLocaleData)`。由于 `getLocaleData` 恒返回稳定引用，React 19 的快照对比不会陷入无限重渲染。返回的语言包对象可直接在 JSX 中消费。

> ⚠️ React 适配层必须使用基于 `useSyncExternalStore` 的快照缓存模式，否则语言切换会触发无限重渲染。

## 关键避坑点

1. **`getLocaleData` 的稳定引用**：组件消费时不可对返回对象做就地修改；要覆盖文案请通过 `registerLocale` 走合并路径，否则会污染缓存、破坏 React 快照对比。
2. **`registerLocale` 的合并粒度**：组级浅合并、未提及字段继承基底，但 `datePicker.weekdays` 这类数组字段是整体替换、不做逐项合并——自定义时需传完整 7 项。
3. **显式 prop 永远优先**：组件文案类 prop 的 spec 与双端实现均保持 `undefined` 默认值，渲染时 `prop ?? locale`；不要在 spec / 实现里写硬编码默认值，否则将绕过语言包。
4. **集成测试结构坑**：
   - React Modal 经 `createPortal` 挂载到 `document.body`，断言须查 `document`，而非 React 渲染容器。
   - Vue Modal 经 `<Teleport>` 挂载到 `document.body`，断言须查 `document.body`。
   - Table 行选择场景：列首还有全选复选框，`boxes[0]` 是全选框，行复选框从 `boxes[1]` 起。
   - DatePicker 传 `defaultValue` 后不再渲染 placeholder，测试 placeholder 须用空 value 场景。
   - `enUS.datePicker.placeholder` 为 `'Select date'`，断言勿写成 `'Select a date'`。
5. **`setLocale` 不存在的 key 静默忽略**：拼写错误不会抛错，调试语言切换问题时先确认 key 已通过 `registerLocale` 或内置包注册。
