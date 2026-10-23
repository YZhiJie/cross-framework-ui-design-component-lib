/** Waterfall 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 瀑布流数据源条目（键值对） */
export type WaterfallItem = Record<string, unknown>;

/** 布局方向
 *
 * - vertical：多列纵向瀑布，按最短列分配，列内自上而下堆叠（默认）
 * - horizontal：多行横向瀑布，按最短行分配，行内自左向右排列，容器横向滚动
 */
export type WaterfallDirection = 'vertical' | 'horizontal';

/** 响应式断点（按 minWidth 升序匹配，首次命中生效） */
export type WaterfallBreakpoint = {
  /** 视口最小宽度（px） */
  minWidth: number;
  /** 该宽度下的列数 */
  columns: number;
};

/** Waterfall Props（Vue 与 React 共用） */
export type WaterfallProps = {
  /** 数据源数组 */
  items: WaterfallItem[];
  /** 条唯一键字段名（缺省用数组下标字符串化） */
  rowKey?: string;
  /** 固定列数（breakpoints 未提供时生效；默认 4） */
  columns?: number;
  /** 布局方向（默认 vertical；horizontal 为多行横向瀑布） */
  direction?: WaterfallDirection;
  /** 横向瀑布流的行数（direction='horizontal' 时生效；缺省回退到 columns） */
  rows?: number;
  /** 响应式断点（提供时优先于 columns；按 minWidth 升序匹配；仅 vertical 生效） */
  breakpoints?: WaterfallBreakpoint[];
  /** 列间距（px，默认 16） */
  gutter?: number;
  /** 滚动容器高度（number px / string；提供后内部变为可滚动容器，支持虚拟滚动和无限滚动） */
  height?: number | string;
  /** 虚拟滚动（需配合 height 使用；仅在所有 item 已测量高度后生效） */
  virtual?: boolean;
  /** 无限滚动触发阈值（px；剩余可滚动高度 < threshold 时触发 onLoadMore；默认 200） */
  loadMoreThreshold?: number;
  /** 无限滚动加载中（为 true 时暂停触发 onLoadMore） */
  loading?: boolean;
  /** 无限滚动数据已全部加载（为 true 时不再触发 onLoadMore） */
  finished?: boolean;
  /** 根节点自定义类名 */
  className?: string;
  /** 根节点内联样式 */
  style?: Record<string, string>;
  /** React 端自定义条目渲染回调（Vue 用 #item 作用域插槽；返回值由框架消费） */
  renderItem?: (item: WaterfallItem, index: number) => unknown;
  /** 条目点击回调 */
  onItemClick?: (item: WaterfallItem, index: number) => void;
  /** 布局变更回调（列数切换、DOM 测量后重排均触发） */
  onLayoutChange?: (payload: WaterfallLayoutPayload) => void;
  /** 无限滚动：接近底部时触发；需配合 height 使用 */
  onLoadMore?: () => void;
};

/** 布局变更事件载荷 */
export type WaterfallLayoutPayload = {
  /** 当前列数（横向模式为当前行数） */
  columnCount: number;
  /** 每列累计高度快照（单位 px，含 gutter；横向模式为空数组） */
  columnHeights: number[];
  /** 布局方向 */
  direction?: WaterfallDirection;
  /** 横向模式每行累计宽度快照（单位 px；纵向模式为空数组） */
  rowWidths?: number[];
};

/** Waterfall 事件契约 */
export type WaterfallEvents = {
  itemClick: (item: WaterfallItem, index: number) => void;
  layoutChange: (payload: WaterfallLayoutPayload) => void;
  loadMore: () => void;
};

/** Waterfall 插槽契约 */
export type WaterfallSlots = {
  /** 空数据内容（未提供时不渲染） */
  empty: Record<string, never>;
  /** 条目自定义渲染（作用域参数 item + index） */
  item: { item: WaterfallItem; index: number };
};

/** Waterfall 状态快照（由逻辑层暴露） */
export type WaterfallState = {
  /** 当前列数（由 columns 或 breakpoints + 视口宽度推导） */
  columnCount: number;
  /** 每列条目 key 数组（按列分组后的分配结果） */
  columns: string[][];
  /** 每列累计高度（单位 px，不含最终 gutter） */
  columnHeights: number[];
};

/** Waterfall 逻辑实例（通用接口 + 交互方法） */
export type WaterfallLogic = LogicInstance<WaterfallProps, WaterfallState> & {
  /** 响应式更新列数（适配层在 ResizeObserver 中调用） */
  setColumnCount: (count: number) => void;
  /** 更新指定条目的测量高度（纵向模式；适配层在 ResizeObserver 中调用） */
  updateItemHeight: (key: string, height: number) => void;
  /** 更新指定条目的测量宽度（横向模式；适配层在 ResizeObserver 中调用） */
  updateItemWidth: (key: string, width: number) => void;
  /** 触发条目点击 */
  handleItemClick: (item: WaterfallItem, index: number) => void;
};
