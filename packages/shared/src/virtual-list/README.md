# @xui-design/shared/virtual-list

虚拟滚动纯逻辑原语（框架无关），为 Table（行）/ Select（选项）等长列表场景统一提供固定行高窗口计算、状态快照与滚动控制能力。

## 职责边界

- **纯逻辑、不碰 DOM**：仅根据滚动偏移与视口高度计算可视区间 `[startIndex, endIndex]`、内容位移 `offsetY` 与总高度 `totalHeight`；滚动事件监听与 DOM 渲染由适配层桥接。
- **框架无关**：不引入 Vue / React，导出 `createVirtualListLogic` 工厂 + 类型供任意适配层桥接。
- **共用窗口计算**：双端 Select / Table 等组件**仅做 DOM 桥接适配**，不重复实现窗口计算逻辑。
- **状态快照不可变**：`getState()` 返回浅拷贝、`subscribe` 收到的是浅拷贝快照，外部修改不影响内部状态。

## 导出 API 清单（index.ts）

| 导出 | 签名 | 说明 |
| --- | --- | --- |
| `createVirtualListLogic` | `function createVirtualListLogic(options?: VirtualListOptions): VirtualListLogicInstance` | 创建虚拟滚动逻辑实例（工厂函数） |
| `VirtualListLogicInstance` | `interface` | 逻辑实例形状，继承 `LogicInstance<VirtualListOptions, VirtualListState>` 并扩展 `scrollTo` / `scrollToIndex` |
| `VirtualListOptions` | `type` | 逻辑配置（由适配层注入并随 Props 同步） |
| `VirtualListState` | `type` | 状态快照形状 |

## 关键类型定义

### `VirtualListOptions`

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

### `VirtualListState`

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

> `itemCount === 0` 时 `endIndex = -1`，适配层据此渲染空列表（不渲染任何行）。

### `VirtualListLogicInstance`

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

其中 `LogicInstance<P, S>` 来自 `@xui-design/shared/types`，提供：

```ts
export interface LogicInstance<P extends Record<string, unknown>, S = unknown> {
  /** 订阅状态变更，返回取消订阅函数 */
  subscribe: (listener: StateListener<S>) => Unsubscribe;
  /** 获取当前状态快照（浅拷贝，外部修改不影响内部状态） */
  getState: () => S;
  /** 外部更新配置（Props 变更时由适配层调用） */
  updateOptions: (options: Partial<P>) => void;
}

export type StateListener<S> = (state: S) => void;
export type Unsubscribe = () => void;
```

## 工作机制

### 默认值与归一化

- `itemCount`：`Math.max(0, Math.floor(options.itemCount ?? 0))`，缺省 `0`。
- `itemHeight`：`Math.max(1, options.itemHeight ?? 32)`，缺省 `32`，最小 `1`（避免除零）。
- `viewportHeight`：`Math.max(0, options.viewportHeight ?? 0)`，缺省 `0`（视口高度未知时窗口仍跟随滚动，由 `overscan` 保底渲染）。
- `overscan`：`Math.max(0, Math.floor(options.overscan ?? DEFAULT_OVERSCAN))`，缺省 `DEFAULT_OVERSCAN = 5`。
- `scrollTop`：初始 `0`。
- 工厂调用时立即 `recompute()` 一次，保证 `getState()` 在首次访问时即返回有效快照。

### 窗口计算（recompute）

1. `totalHeight = itemCount * itemHeight`
2. `maxScroll = Math.max(0, totalHeight - viewportHeight)`，`clampedScroll = Math.min(Math.max(0, scrollTop), maxScroll)`（越界滚动自动 clamp）
3. `visibleCount = viewportHeight > 0 ? Math.ceil(viewportHeight / itemHeight) : 0`
4. `rawStart = Math.floor(clampedScroll / itemHeight)`（起始下标仅由滚动偏移决定）
5. `startIndex = Math.min(Math.max(0, rawStart - overscan), Math.max(0, itemCount - 1))`
6. `endIndex = itemCount === 0 ? -1 : Math.min(itemCount - 1, rawStart + visibleCount + overscan)`（含尾）
7. `offsetY = startIndex * itemHeight`
8. `fillerHeight = Math.max(0, totalHeight - offsetY - (endIndex - startIndex + 1) * itemHeight)`

### 状态变更判定（避免多余通知）

`recompute` 计算后逐字段比对 `startIndex / endIndex / offsetY / fillerHeight / totalHeight / scrollTop`，**所有字段都未变化时直接 return**，不重建快照、不通知订阅者。这是避免高频滚动事件触发多余渲染的关键。

### subscribe（通知）

- 基于 `Set<StateListener<VirtualListState>>`，状态变化时构造 `{ ...state }` 浅拷贝快照推送给所有监听器；返回的取消订阅函数会把对应 listener 从集合中删除。
- 监听器收到的快照与 `getState()` 返回的结构一致，可直接用于渲染决策。

### getState（快照）

- 返回 `{ ...state }` 浅拷贝，外部修改不影响内部状态；适配层可在任意时机调用获取当前快照。

### updateOptions（配置同步）

- 仅当传入字段与当前值不同时才更新并标记 `changed = true`；所有字段处理完后若 `changed` 为真才调用 `recompute()`，避免无变化时多余重算。
- `itemCount` / `overscan` 走 `Math.floor`；`itemHeight` / `viewportHeight` 不走 `Math.floor`（适配层负责传入整数像素值）。
- 未传入的字段保持不变（`Partial<P>` 语义）。

### scrollTo

- 设置 `scrollTop = offset`，调用 `recompute()`；越界偏移由 `recompute` 内部的 `clampedScroll` 自动 clamp。

### scrollToIndex

- `itemCount === 0` 时直接 return。
- `clamped = Math.min(Math.max(0, Math.floor(index)), itemCount - 1)`，`itemTop = clamped * itemHeight`，`itemBottom = itemTop + itemHeight`。
- `align === 'auto'` 且目标已在当前窗口内（`itemTop >= startIndex * itemHeight && itemBottom <= (endIndex + 1) * itemHeight`）时直接 return，不滚动——避免重复滚动到已可见项。
- `maxScroll = Math.max(0, itemCount * itemHeight - viewportHeight)`。
- `align === 'end'`：`next = itemBottom - viewportHeight`（目标贴视口底边）。
- `align === 'start'` 或 `align === 'auto'`（目标不在窗口内）：`next = itemTop`（目标贴视口顶边）。
- `scrollTop = Math.min(Math.max(0, next), maxScroll)`，调用 `recompute()`。

## 使用示例

```ts
import { createVirtualListLogic } from '@xui-design/shared/virtual-list';

// 1) 创建实例（一万条数据，每条 32px）
const list = createVirtualListLogic({
  itemCount: 10000,
  itemHeight: 32,
  viewportHeight: 400,
  overscan: 5,
});

// 2) 订阅窗口变化
const unsubscribe = list.subscribe((state) => {
  console.log(
    'render rows [%d, %d], offsetY=%d, fillerHeight=%d, totalHeight=%d',
    state.startIndex,
    state.endIndex,
    state.offsetY,
    state.fillerHeight,
    state.totalHeight,
  );
});

// 3) 滚动到指定偏移（越界自动 clamp）
list.scrollTo(320); // 滚动 10 行

// 4) 滚动到指定条目（align 默认 auto：已在窗口内则不动）
list.scrollToIndex(500); // 滚动到第 500 条
list.scrollToIndex(500, 'start'); // 强制贴顶
list.scrollToIndex(500, 'end'); // 强制贴底

// 5) Props 变更时同步配置
list.updateOptions({ itemCount: 20000 });

// 6) 获取当前快照（不订阅）
const snapshot = list.getState();

// 7) 卸载时取消订阅
unsubscribe();
```

## 双端接入方式

适配层把 `subscribe` + `getState` 桥接到各框架的响应式系统，**仅做 DOM 桥接**，不重复实现窗口计算：

- **Vue 3（`useLogicState` / `useVirtualList`）**：在 Composable 内部 `createVirtualListLogic()` 创建实例，调用 `list.subscribe` 把快照写入 `shallowRef<VirtualListState>`，模板据此渲染窗口区间内的行 + 头部 / 尾部 spacer（`height: offsetY` / `height: fillerHeight`）。滚动容器的 `scroll` 事件回调中调用 `list.scrollTo(scrollEl.scrollTop)`；Props 变更时调用 `list.updateOptions(...)`。
- **React 19（`useSyncExternalStore` + 快照缓存）**：使用 `useSyncExternalStore(list.subscribe, list.getState, list.getState)`。**必须使用快照缓存模式**——由于 `getState` 返回的是每次新建的浅拷贝，React 19 的 `useSyncExternalStore` 会对 `getSnapshot` 返回值做引用对比；适配层需缓存上一次返回的快照引用，仅当内部状态真正变化时才更新缓存引用，否则 `useSyncExternalStore` 会因每次返回新对象陷入无限重渲染。滚动事件回调中调用 `list.scrollTo(scrollTop)`；Props 变更时调用 `list.updateOptions(...)`。

> ⚠️ React 适配层**必须**使用基于 `useSyncExternalStore` 的快照缓存模式，否则会出现无限重渲染。具体做法：用 `useRef` 缓存最近一次 `getState()` 返回的快照，在 `subscribe` 回调中更新缓存引用并触发 `useSyncExternalStore` 重读，`getSnapshot` 直接返回缓存引用。

## 关键避坑点

1. **固定行高前提**：本模块假设行高固定（`itemHeight` 全列表一致），不处理动态行高场景；行高可变时不要使用本模块，否则 `offsetY` / `totalHeight` 会失真。
2. **`viewportHeight = 0` 的退化**：视口高度未知时 `visibleCount = 0`，`endIndex` 仅由 `rawStart + overscan` 决定；适配层在容器尺寸测量完成前会渲染少量缓冲行，测量完成后必须 `updateOptions({ viewportHeight })` 才能得到正确窗口。
3. **`itemCount === 0` 的 `endIndex = -1`**：空列表时 `endIndex` 为 `-1`，适配层渲染循环需处理 `endIndex < startIndex` 的空区间，不要假定 `endIndex >= startIndex`。
4. **`scrollToIndex` 的 `auto` 语义**：`align` 默认 `auto`，目标已在窗口内时**不滚动**；适配层若需要强制滚动到目标，须显式传 `'start'` / `'end'`。
5. **`recompute` 的去重通知**：状态字段全部未变化时不通知；适配层依赖 `subscribe` 触发渲染时，`updateOptions` 若未引起实际变化不会触发重渲染——这是预期行为，不是 bug。
6. **快照不可变**：`getState()` 与 `subscribe` 回调收到的都是浅拷贝，外部修改不会回写内部状态；要改变状态只能通过 `scrollTo` / `scrollToIndex` / `updateOptions`。
7. **React 快照缓存**：React 适配层必须缓存 `getState()` 返回的快照引用，否则 `useSyncExternalStore` 会因每次返回新对象而无限重渲染（与 locale / theme / floating 的 React 适配层一致约定）。
8. **共用逻辑不重复实现**：双端 Select / Table 等组件**仅做 DOM 桥接适配**，禁止在组件层重新实现窗口计算逻辑；新增长列表组件应直接消费 `createVirtualListLogic`。
9. **`updateOptions` 的部分更新**：仅传入需要变更的字段，未传入字段保持不变；不要在每次 Props 变更时传全量配置，否则会触发不必要的 `recompute`（虽然内部有去重，但仍是不必要的开销）。
