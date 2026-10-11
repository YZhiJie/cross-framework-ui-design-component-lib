/**
 * VirtualList 纯逻辑原语
 *
 * 固定行高虚拟滚动的窗口计算核心，供 Table（行）/ Select（选项）等长列表场景复用。
 * 职责：根据滚动偏移与视口高度计算可视区间 [startIndex, endIndex]、
 * 内容位移 offsetY 与总高度 totalHeight；不触碰任何 DOM（滚动事件由适配层桥接）。
 * 通过 subscribe 通知窗口变化，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../types';

/** VirtualList 逻辑配置（由适配层注入并随 Props 同步） */
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

/** VirtualList 状态快照 */
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

/** VirtualList 逻辑实例 */
export interface VirtualListLogicInstance extends LogicInstance<
  VirtualListOptions,
  VirtualListState
> {
  /** 滚动容器滚动到指定偏移（px，越界自动 clamp） */
  scrollTo: (offset: number) => void;
  /** 滚动到指定条目（index 越界自动 clamp；align 默认 auto：目标已在窗口内则不动） */
  scrollToIndex: (index: number, align?: 'start' | 'end' | 'auto') => void;
}

const DEFAULT_OVERSCAN = 5;

export function createVirtualListLogic(options: VirtualListOptions = {}): VirtualListLogicInstance {
  let itemCount = Math.max(0, Math.floor(options.itemCount ?? 0));
  let itemHeight = Math.max(1, options.itemHeight ?? 32);
  let viewportHeight = Math.max(0, options.viewportHeight ?? 0);
  let overscan = Math.max(0, Math.floor(options.overscan ?? DEFAULT_OVERSCAN));
  let scrollTop = 0;

  const state: VirtualListState = {
    startIndex: 0,
    endIndex: 0,
    offsetY: 0,
    fillerHeight: 0,
    totalHeight: 0,
    scrollTop: 0,
  };

  const listeners = new Set<StateListener<VirtualListState>>();

  /** 依据当前滚动偏移重算可视窗口（值未变化时不通知） */
  const recompute = (): void => {
    const totalHeight = itemCount * itemHeight;
    const maxScroll = Math.max(0, totalHeight - viewportHeight);
    const clampedScroll = Math.min(Math.max(0, scrollTop), maxScroll);
    const visibleCount = viewportHeight > 0 ? Math.ceil(viewportHeight / itemHeight) : 0;

    // 起始下标仅由滚动偏移决定（视口高度未知时窗口仍跟随滚动，由 overscan 保底渲染）
    const rawStart = Math.floor(clampedScroll / itemHeight);
    const startIndex = Math.min(Math.max(0, rawStart - overscan), Math.max(0, itemCount - 1));
    const endIndex =
      itemCount === 0 ? -1 : Math.min(itemCount - 1, rawStart + visibleCount + overscan);

    const offsetY = startIndex * itemHeight;
    const fillerHeight = Math.max(
      0,
      totalHeight - offsetY - (endIndex - startIndex + 1) * itemHeight,
    );

    const unchanged =
      state.startIndex === startIndex &&
      state.endIndex === endIndex &&
      state.offsetY === offsetY &&
      state.fillerHeight === fillerHeight &&
      state.totalHeight === totalHeight &&
      state.scrollTop === clampedScroll;

    if (unchanged) return;

    state.startIndex = startIndex;
    state.endIndex = endIndex;
    state.offsetY = offsetY;
    state.fillerHeight = fillerHeight;
    state.totalHeight = totalHeight;
    state.scrollTop = clampedScroll;

    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  recompute();

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      if (next.itemCount !== undefined) {
        const value = Math.max(0, Math.floor(next.itemCount));
        if (value !== itemCount) {
          itemCount = value;
          changed = true;
        }
      }
      if (next.itemHeight !== undefined) {
        const value = Math.max(1, next.itemHeight);
        if (value !== itemHeight) {
          itemHeight = value;
          changed = true;
        }
      }
      if (next.viewportHeight !== undefined) {
        const value = Math.max(0, next.viewportHeight);
        if (value !== viewportHeight) {
          viewportHeight = value;
          changed = true;
        }
      }
      if (next.overscan !== undefined) {
        const value = Math.max(0, Math.floor(next.overscan));
        if (value !== overscan) {
          overscan = value;
          changed = true;
        }
      }

      if (changed) recompute();
    },

    scrollTo(offset) {
      scrollTop = offset;
      recompute();
    },

    scrollToIndex(index, align = 'auto') {
      if (itemCount === 0) return;
      const clamped = Math.min(Math.max(0, Math.floor(index)), itemCount - 1);
      const itemTop = clamped * itemHeight;
      const itemBottom = itemTop + itemHeight;

      if (
        align === 'auto' &&
        itemTop >= state.startIndex * itemHeight &&
        itemBottom <= (state.endIndex + 1) * itemHeight
      ) {
        return;
      }

      const maxScroll = Math.max(0, itemCount * itemHeight - viewportHeight);
      let next: number;
      if (align === 'end') {
        next = itemBottom - viewportHeight;
      } else {
        next = itemTop;
      }
      scrollTop = Math.min(Math.max(0, next), maxScroll);
      recompute();
    },
  };
}
