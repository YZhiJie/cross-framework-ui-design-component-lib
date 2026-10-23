/**
 * Waterfall 纯逻辑工厂
 *
 * 职责：最短列贪心分配 + 高度缓存 + 列数变化重排。
 * 不触碰 DOM / window，所有尺寸数据由适配层通过 updateOptions / setColumnCount / updateItemHeight 注入。
 *
 * 布局算法：
 *  遍历 items，每项取已缓存的测量高度（未测量时 0 占位），
 *  追加到当前累计高度最短的列。列数变化 / 新 item 进入 / 高度更新均触发重排，
 *  复用已缓存高度，避免重复测量 DOM。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 数据源条目 */
export type WaterfallItem = Record<string, unknown>;

/** 布局方向 */
export type WaterfallDirection = 'vertical' | 'horizontal';

/** 逻辑配置（由适配层从 Props 中提取注入） */
export type WaterfallLogicOptions = {
  /** 数据源数组 */
  items?: WaterfallItem[];
  /** 条唯一键字段名（缺省用数组下标字符串化） */
  rowKey?: string;
  /** 初始列数（默认 4） */
  columns?: number;
  /** 布局方向（默认 vertical） */
  direction?: WaterfallDirection;
  /** 横向模式行数（缺省回退到 columns） */
  rows?: number;
  /** 列间距（仅在 onLayoutChange payload 中透传） */
  gutter?: number;
  /** 条目点击回调 */
  onItemClick?: (item: WaterfallItem, index: number) => void;
  /** 布局变更回调 */
  onLayoutChange?: (payload: WaterfallLayoutPayload) => void;
};

/** 布局变更载荷 */
export type WaterfallLayoutPayload = {
  /** 当前列数（横向模式为行数） */
  columnCount: number;
  /** 每列累计内容高度（px，不含 gutter；横向模式为空数组） */
  columnHeights: number[];
  /** 布局方向 */
  direction: WaterfallDirection;
  /** 横向模式每行累计内容宽度（px；纵向模式为空数组） */
  rowWidths: number[];
  /** 当前 gutter（px，透传给消费者） */
  gutter: number;
};

/** 状态快照 */
export type WaterfallState = {
  /** 当前列数（横向模式为行数） */
  columnCount: number;
  /** 当前布局方向 */
  direction: WaterfallDirection;
  /** 每列/每行条目 key 数组 */
  columns: string[][];
  /** 每列累计内容高度（纵向模式；横向模式为空数组） */
  columnHeights: number[];
  /** 横向模式每行累计内容宽度（纵向模式为空数组） */
  rowWidths: number[];
  /** 所有已测量 item 的高度缓存（key → height；未测量的 key 不在此 Map 中） */
  itemHeights: ReadonlyMap<string, number>;
  /** 所有已测量 item 的宽度缓存（横向模式使用） */
  itemWidths: ReadonlyMap<string, number>;
};

/** 逻辑实例接口 */
export interface WaterfallLogicInstance extends LogicInstance<
  WaterfallLogicOptions,
  WaterfallState
> {
  /** 响应式更新列数（适配层在 ResizeObserver 中调用） */
  setColumnCount: (count: number) => void;
  /** 更新指定条目的测量高度（纵向模式） */
  updateItemHeight: (key: string, height: number) => void;
  /** 更新指定条目的测量宽度（横向模式） */
  updateItemWidth: (key: string, width: number) => void;
  /** 触发条目点击事件 */
  handleItemClick: (item: WaterfallItem, index: number) => void;
}

/** 生成条唯一键 */
function keyFor(item: WaterfallItem, rowKey: string | undefined, index: number): string {
  if (rowKey && item[rowKey] !== undefined && item[rowKey] !== null) {
    return String(item[rowKey]);
  }
  return String(index);
}

/** 最短轨道贪心分配（纯函数，可单测）
 *
 * 纵向模式轨道 = 列（尺寸为 item 高度），横向模式轨道 = 行（尺寸为 item 宽度），
 * 算法本身与方向无关，因此统一用「轨道 + 尺寸」抽象。
 *
 * 核心策略：存在严格更短的轨道 → 直接命中；并列最短时做 round-robin 轮询，
 * 保证初始未测量（所有尺寸为 0）场景下均匀分布，同时不破坏真实差异后的贪心行为。
 *
 * @param itemKeys      所有条目的 key 数组（按原顺序）
 * @param itemSizes     已测量尺寸缓存 Map（缺失的 key 用 0 占位）
 * @param trackCount    轨道数（>= 1）
 * @returns columns 分组 + columnHeights 累计尺寸
 */
export function shortestTrackAssign(
  itemKeys: string[],
  itemSizes: Map<string, number>,
  trackCount: number,
): { columns: string[][]; columnHeights: number[] } {
  const n = Math.max(1, trackCount);
  const columns: string[][] = Array.from({ length: n }, () => []);
  const columnHeights: number[] = new Array(n).fill(0);
  let lastPicked = -1;

  for (const key of itemKeys) {
    const h = itemSizes.get(key) ?? 0;

    // 1) 找最短列，同时收集并列最短集合
    let minHeight = columnHeights[0];
    const tied: number[] = [0];
    for (let i = 1; i < n; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        tied.length = 0;
        tied.push(i);
      } else if (columnHeights[i] === minHeight) {
        tied.push(i);
      }
    }

    // 2) 并列最短时：优先选上次 picked 的下一列（round-robin），否则取 tied[0]
    let shortestIdx: number;
    if (tied.length === 1) {
      shortestIdx = tied[0];
    } else {
      const preferNext = (lastPicked + 1) % n;
      let pickedIdx = -1;
      for (const t of tied) {
        if (t >= preferNext) {
          pickedIdx = t;
          break;
        }
      }
      shortestIdx = pickedIdx === -1 ? tied[0] : pickedIdx;
    }

    columns[shortestIdx].push(key);
    columnHeights[shortestIdx] += h;
    lastPicked = shortestIdx;
  }

  return { columns, columnHeights };
}

/** 最短列贪心分配（纵向模式别名，保持既有 API 与单测兼容） */
export function shortestColumnAssign(
  itemKeys: string[],
  itemHeights: Map<string, number>,
  columnCount: number,
): { columns: string[][]; columnHeights: number[] } {
  return shortestTrackAssign(itemKeys, itemHeights, columnCount);
}

export function createWaterfallLogic(options: WaterfallLogicOptions = {}): WaterfallLogicInstance {
  const listeners = new Set<StateListener<WaterfallState>>();

  // 当前数据源（items + rowKey 变化时刷新 itemKeys）
  let items: WaterfallItem[] = options.items ?? [];
  let rowKey: string | undefined = options.rowKey;
  let columnCount = Math.max(1, options.columns ?? 4);
  let direction: WaterfallDirection = options.direction ?? 'vertical';
  let rows = Math.max(1, options.rows ?? columnCount);
  let gutter = options.gutter ?? 16;

  // 回调 latest-ref 化
  let onItemClickCb = options.onItemClick;
  let onLayoutChangeCb = options.onLayoutChange;

  // 高度缓存（纵向模式；适配层 DOM 测量后回写，列数变化时复用）
  const itemHeights = new Map<string, number>();
  // 宽度缓存（横向模式）
  const itemWidths = new Map<string, number>();

  /** 当前轨道数：纵向 = 列数，横向 = 行数 */
  function currentTrackCount(): number {
    return direction === 'horizontal' ? rows : columnCount;
  }

  // 当前 itemKeys（与 items 顺序一致）
  let itemKeys: string[] = items.map((it, i) => keyFor(it, rowKey, i));

  const state: WaterfallState = {
    columnCount: currentTrackCount(),
    direction,
    columns: [],
    columnHeights: [],
    rowWidths: [],
    itemHeights,
    itemWidths,
  };

  // 当前 items 的 key → index 映射（handleItemClick 反查用）
  let keyToIndex = new Map<string, number>();

  function rebuildKeyToIndex(): void {
    keyToIndex = new Map();
    for (let i = 0; i < items.length; i++) {
      keyToIndex.set(keyFor(items[i], rowKey, i), i);
    }
  }

  function doLayout(): void {
    const trackCount = currentTrackCount();
    const { columns, columnHeights } = shortestTrackAssign(
      itemKeys,
      direction === 'horizontal' ? itemWidths : itemHeights,
      trackCount,
    );

    state.columnCount = trackCount;
    state.direction = direction;
    state.columns = columns;
    state.columnHeights = direction === 'horizontal' ? [] : columnHeights;
    state.rowWidths = direction === 'horizontal' ? columnHeights : [];

    const payload: WaterfallLayoutPayload = {
      columnCount: trackCount,
      columnHeights: state.columnHeights,
      direction,
      rowWidths: state.rowWidths,
      gutter,
    };
    onLayoutChangeCb?.(payload);
  }

  function notify(): void {
    const snapshot: WaterfallState = {
      columnCount: state.columnCount,
      direction: state.direction,
      columns: state.columns,
      columnHeights: state.columnHeights,
      rowWidths: state.rowWidths,
      itemHeights: itemHeights as ReadonlyMap<string, number>,
      itemWidths: itemWidths as ReadonlyMap<string, number>,
    };
    listeners.forEach((l) => l(snapshot));
  }

  // 初始布局
  rebuildKeyToIndex();
  doLayout();

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState(): WaterfallState {
      return {
        columnCount: state.columnCount,
        direction: state.direction,
        columns: state.columns.map((col) => [...col]),
        columnHeights: [...state.columnHeights],
        rowWidths: [...state.rowWidths],
        itemHeights: itemHeights as ReadonlyMap<string, number>,
        itemWidths: itemWidths as ReadonlyMap<string, number>,
      };
    },

    updateOptions(next) {
      let needRelayout = false;

      if (next.items !== undefined && next.items !== items) {
        items = next.items;
        itemKeys = items.map((it, i) => keyFor(it, rowKey, i));
        rebuildKeyToIndex();
        needRelayout = true;
      }
      if (next.rowKey !== undefined && next.rowKey !== rowKey) {
        rowKey = next.rowKey;
        itemKeys = items.map((it, i) => keyFor(it, rowKey, i));
        rebuildKeyToIndex();
        needRelayout = true;
      }
      if (next.direction !== undefined && next.direction !== direction) {
        direction = next.direction;
        needRelayout = true;
      }
      if (next.columns !== undefined && next.columns !== columnCount) {
        columnCount = Math.max(1, next.columns);
        // rows 未显式指定时跟随 columns（横向模式缺省行数）
        if (options.rows === undefined && next.rows === undefined) {
          rows = columnCount;
        }
        needRelayout = true;
      }
      if (next.rows !== undefined && next.rows !== rows) {
        rows = Math.max(1, next.rows);
        needRelayout = true;
      }
      if (next.gutter !== undefined) {
        gutter = next.gutter; // 仅用于 payload 透传，不触发重排
      }
      if (next.onItemClick !== undefined) onItemClickCb = next.onItemClick;
      if (next.onLayoutChange !== undefined) onLayoutChangeCb = next.onLayoutChange;

      if (needRelayout) {
        doLayout();
        notify();
      }
    },

    setColumnCount(count) {
      const c = Math.max(1, count);
      if (direction === 'horizontal') {
        if (c === rows) return;
        rows = c;
      } else {
        if (c === columnCount) return;
        columnCount = c;
      }
      doLayout();
      notify();
    },

    updateItemHeight(key, height) {
      const prev = itemHeights.get(key);
      if (prev === height) return; // 高度未变，跳过
      itemHeights.set(key, height);
      // 横向模式由宽度决定布局，高度变化只缓存不重排
      if (direction === 'horizontal') return;
      doLayout();
      notify();
    },

    updateItemWidth(key, width) {
      const prev = itemWidths.get(key);
      if (prev === width) return; // 宽度未变，跳过
      itemWidths.set(key, width);
      // 纵向模式由高度决定布局，宽度变化只缓存不重排
      if (direction !== 'horizontal') return;
      doLayout();
      notify();
    },

    handleItemClick(item, index) {
      onItemClickCb?.(item, index);
    },
  };
}
