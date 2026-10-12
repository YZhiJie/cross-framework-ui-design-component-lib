# @xui/shared/floating

浮层视口避让纯逻辑（框架无关），为 Tooltip / Popconfirm / Select 等浮层组件统一提供方位翻转与交叉轴偏移钳制计算，并订阅滚动 / resize 事件触发重算。

## 职责边界

- **纯逻辑、不碰 DOM**：`resolveFloatingPosition` 是纯函数，输入视口坐标矩形（兼容 `DOMRect` 结构），输出最终方位与平移量；不读取 DOM、不写样式，便于单测。
- **框架无关**：不引入 Vue / React；DOM 测量（`getBoundingClientRect`）、滚动监听与样式应用由双端适配层桥接。
- **共用避让逻辑**：双端 Tooltip / Popconfirm / Select 等浮层组件共用本模块，**不重复实现**窗口计算。
- **SSR 安全降级**：`getViewport` / `bindViewportUpdate` 在无 `window` 环境下返回零矩形 / 空解绑函数，不抛错。

## 导出 API 清单（index.ts）

| 导出 | 签名 | 说明 |
| --- | --- | --- |
| `resolveFloatingPosition` | `function resolveFloatingPosition(trigger: FloatingRect, popper: FloatingRect, viewport: FloatingViewport, options: ResolveFloatingOptions): FloatingPosition` | 计算浮层相对视口的最终方位与交叉轴偏移 |
| `getViewport` | `function getViewport(): FloatingViewport` | 获取当前视口边界（整页可视区域） |
| `bindViewportUpdate` | `function bindViewportUpdate(callback: () => void): () => void` | 订阅视口变化（scroll / resize），回调经 rAF 合并，返回解绑函数 |
| `FloatingPlacement` | `type` | 四方位联合类型 `'top' \| 'bottom' \| 'left' \| 'right'` |
| `FloatingRect` | `type` | 视口坐标矩形（兼容 `Pick<DOMRect, ...>`） |
| `FloatingViewport` | `type` | 视口边界 |
| `ResolveFloatingOptions` | `type` | `resolveFloatingPosition` 的入参选项 |
| `FloatingPosition` | `type` | 避让计算结果 |

## 关键类型定义

### `FloatingPlacement`

```ts
export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';
```

与 core 契约的 placement 联合类型对齐。

### `FloatingRect`

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

可直接传 `getBoundingClientRect()` 的结果。

### `FloatingViewport`

```ts
export type FloatingViewport = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
```

视口坐标；整页场景即 `{ top: 0, left: 0, right: innerWidth, bottom: innerHeight }`。

### `ResolveFloatingOptions`

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

`gap` / `viewportPadding` 缺省时分别取 `DEFAULT_GAP = 8` 与 `DEFAULT_VIEWPORT_PADDING = 8`。

### `FloatingPosition`

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

## 工作机制

### 定位模型（CSS 包裹方案）

沿用组件 CSS 包裹方案，浮层随文档流自动跟随触发器，本模块仅负责避让修正：

- `top`：浮层底边距触发器顶边 `gap`，水平居中
- `bottom`：浮层顶边距触发器底边 `gap`，水平居中
- `left` / `right`：垂直居中

### flip：方位翻转规则

计算首选方位与对侧的可用空间：

- `spaceAbove = trigger.top - viewport.top`
- `spaceBelow = viewport.bottom - trigger.bottom`
- `spaceLeft = trigger.left - viewport.left`
- `spaceRight = viewport.right - trigger.right`
- `needVertical = popper.height + gap`、`needHorizontal = popper.width + gap`

翻转判定（**避免抖动**的关键）：

| 首选方位 | 翻转到 | 触发条件 |
| --- | --- | --- |
| `top` | `bottom` | `spaceAbove < needVertical && spaceBelow > spaceAbove` |
| `bottom` | `top` | `spaceBelow < needVertical && spaceAbove > spaceBelow` |
| `left` | `right` | `spaceLeft < needHorizontal && spaceRight > spaceLeft` |
| `right` | `left` | `spaceRight < needHorizontal && spaceLeft > spaceRight` |

**核心约束**：只有当首选方位空间不足**且**对侧空间更充足时才翻转；两侧都不足时维持首选方位（选空间较大的一侧由后续 shift 钳制兜底），避免在边界附近来回翻转造成抖动。

### shift：交叉轴偏移钳制

居中对齐后向视口安全区钳制（交叉轴）：

- `top` / `bottom` 方位：`idealLeft = trigger.left + (trigger.width - popper.width) / 2`，钳制到 `[viewport.left + padding, viewport.right - padding - popper.width]`，`shift = clamped - idealLeft`（水平位移，正向右移）。
- `left` / `right` 方位：`idealTop = trigger.top + (trigger.height - popper.height) / 2`，钳制到 `[viewport.top + padding, viewport.bottom - padding - popper.height]`，`shift = clamped - idealTop`（垂直位移，正向下移）。
- 钳制函数 `clamp(value, min, max)`：`max < min` 时返回 `min`（视口不足以容纳浮层时退化为贴左 / 贴上边），否则 `Math.min(Math.max(value, min), max)`。
- 适配层把 `shift` 叠加到浮层 `margin` / `transform` 上，与首选方位 CSS 居中基准叠加。

**安全区语义**：交叉轴溢出视口时保持 `≥ 8px`（默认 `viewportPadding`）安全区，避免浮层贴边或被裁切。

### getViewport

- 无 `window` 时返回零矩形 `{ top: 0, right: 0, bottom: 0, left: 0 }`，此时 `resolveFloatingPosition` 计算结果等价于"不翻转不偏移"。
- 有 `window` 时返回 `{ top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }`（整页可视区域）。

### bindViewportUpdate：滚动 / resize 监听

CSS 包裹定位的浮层会随文档流自动跟随触发器，但滚动 / 缩放后可用空间变化，已展开浮层的翻转 / 钳制结果需要重算。

- **scroll 以 capture 方式监听 `window`**：滚动事件不冒泡，祖先容器的滚动只能在捕获阶段于 `window` 收到；任意祖先容器内滚动都会触发回调。
- **resize 监听 `window`**：默认（冒泡）阶段即可。
- **rAF 合并重算**：回调经 `requestAnimationFrame` 调度，一帧内最多执行一次——多次 scroll / resize 事件合并为一次重算，避免高频事件触发抖动。
- **自动解绑**：返回的函数会 `removeEventListener` 解绑 scroll / resize，并 `cancelAnimationFrame` 取消未执行的调度帧；组件卸载时调用即可彻底清理。
- **SSR / 无 `window`**：返回空解绑函数 `() => {}`，不抛错。

## 使用示例

```ts
import {
  bindViewportUpdate,
  getViewport,
  resolveFloatingPosition,
} from '@xui/shared/floating';

// 1) 单次计算：给定触发器 / 浮层 / 视口矩形
const trigger = triggerEl.getBoundingClientRect();
const popper = popperEl.getBoundingClientRect();
const viewport = getViewport();

const { placement, shift } = resolveFloatingPosition(trigger, popper, viewport, {
  placement: 'top',
  gap: 8,
  viewportPadding: 8,
});

// 适配层依据 placement 切换 CSS 方位类、依据 shift 叠加 transform
popperEl.style.transform = `translateX(${shift}px)`;

// 2) 滚动 / resize 触发重算
const unbind = bindViewportUpdate(() => {
  const next = resolveFloatingPosition(
    triggerEl.getBoundingClientRect(),
    popperEl.getBoundingClientRect(),
    getViewport(),
    { placement: 'top' },
  );
  // 应用 next.placement / next.shift ...
});
// 组件卸载时
unbind();
```

## 双端接入方式

适配层桥接 DOM 测量、滚动监听与样式应用，**不重复实现**避让逻辑：

- **Vue 3**：在浮层组件的 `onMounted` 中读取 `triggerEl` / `popperEl` 的 `getBoundingClientRect()`，调用 `resolveFloatingPosition` 得到 `{ placement, shift }`，通过 `ref` 写入模板的 class / style；`bindViewportUpdate` 在 `onMounted` 注册、`onBeforeUnmount` 解绑。响应式追踪由 Vue 自身完成。
- **React 19**：在 `useLayoutEffect` / `useEffect` 中读取 rect 并计算，结果写入 `useState` / `useSyncExternalStore`；`bindViewportUpdate` 在 effect 中注册、cleanup 中解绑。多个浮层共用本模块的纯函数，无需各自实现避让算法。

> ⚠️ React 适配层使用 `useSyncExternalStore` + 快照缓存模式（与 locale / theme 一致），避免高频 scroll 事件触发无限重渲染。

## 关键避坑点

1. **CSS 包裹定位前提**：本模块假设浮层已通过 CSS 包裹方案随文档流跟随触发器，输出仅是避让修正；适配层必须先保证基础定位（居中 + gap）正确，再叠加 `shift`。
2. **翻转避免抖动**：翻转条件是"首选方位空间不足 **且** 对侧更充足"，两侧都不足时不翻转——适配层不要在调用前自行做翻转判定，否则会破坏抖动抑制。
3. **`shift` 的方向语义**：`top` / `bottom` 方位为水平位移（正向右移），`left` / `right` 方位为垂直位移（正向下移）；适配层叠加 transform 时需按方位选择 `translateX` / `translateY`。
4. **scroll 必须用 capture**：滚动事件不冒泡，祖先容器滚动只能在捕获阶段于 `window` 收到；`bindViewportUpdate` 已用 `addEventListener('scroll', schedule, true)`，适配层不要自行改回冒泡监听。
5. **rAF 合并的副作用**：回调在下一帧执行，浮层在滚动瞬间会有极短延迟；如需立即应用可在适配层额外同步调用一次 `resolveFloatingPosition`。
6. **组件卸载必须解绑**：`bindViewportUpdate` 返回的解绑函数必须在组件卸载时调用，否则 scroll / resize 监听会泄漏、回调引用已卸载组件的 DOM。
7. **SSR / 无 `window` 降级**：`getViewport` 返回零矩形、`bindViewportUpdate` 返回空函数；适配层不要在 SSR 阶段依赖实际矩形数据。
8. **共用逻辑不重复实现**：Tooltip / Popconfirm / Select 等浮层组件双端共用本模块，**禁止在组件层重新实现**翻转 / 钳制算法。
