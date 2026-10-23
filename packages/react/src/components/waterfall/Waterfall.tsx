/**
 * Waterfall - React 19 适配层
 *
 * 核心链路：
 *  1. ResizeObserver 监听容器宽度 → rAF 合并 → 用 breakpoints 算新列数 → logic.setColumnCount()
 *  2. ResizeObserver 监听每个 item 高度变化（图片加载、内容变化）→ logic.updateItemHeight()
 *  3. 两者都触发重排，rAF 合并保证一帧内多次变更只执行一次 doLayout
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { WaterfallItem, WaterfallProps } from '@xui-design/core';
import {
  createWaterfallLogic,
  resolveColumnCount,
  computeAllColumnsWindows,
  buildPrefixHeights,
} from '@xui-design/shared';
import type { WaterfallLogicInstance, ColumnVirtualWindow } from '@xui-design/shared';
import { useLogicState } from '../../hooks/use-logic-state';
import { cn } from '../../utils/cn';

/** 生成条唯一键（与逻辑层保持一致） */
function keyFor(item: Record<string, unknown>, rowKey: string | undefined, index: number): string {
  if (rowKey && item[rowKey] !== undefined && item[rowKey] !== null) {
    return String(item[rowKey]);
  }
  return String(index);
}

export function Waterfall(props: WaterfallProps) {
  const {
    items,
    rowKey,
    columns = 4,
    breakpoints,
    gutter = 16,
    height,
    virtual,
    loadMoreThreshold = 200,
    loading,
    finished,
    className,
    style,
    renderItem,
    onItemClick,
    onLayoutChange,
    onLoadMore,
  } = props;

  // ---- latest-ref 回调隔离（避免 effect 重跑竞态） ----
  const callbacksRef = useRef({ onItemClick, onLayoutChange, onLoadMore });
  callbacksRef.current = { onItemClick, onLayoutChange, onLoadMore };

  // ---- 逻辑实例（惰性初始化，strict-mode 安全） ----
  const logicRef = useRef<WaterfallLogicInstance | null>(null);
  if (logicRef.current === null) {
    logicRef.current = createWaterfallLogic({
      items,
      rowKey,
      columns,
      gutter,
      onItemClick: (item, index) => callbacksRef.current.onItemClick?.(item, index),
      onLayoutChange: (payload) => callbacksRef.current.onLayoutChange?.(payload),
    });
  }
  const logic = logicRef.current;

  const state = useLogicState(logic.subscribe, logic.getState);

  // Props 值变化同步到逻辑层（回调用 latest-ref，不走 updateOptions）
  useEffect(() => {
    logic.updateOptions({ items, rowKey, columns, gutter });
  }, [logic, items, rowKey, columns, gutter]);

  // ---- DOM refs ----
  const containerRef = useRef<HTMLDivElement | null>(null);
  /** 条目 key → DOM 元素（ResizeObserver 测量用） */
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  // ---- ResizeObserver 链路 ----
  const frameRef = useRef<number | null>(null);
  const firstMeasureRef = useRef(true);

  /** 一帧内统一执行：容器列数测量 + 所有 item 高度测量 */
  const doMeasureAndLayout = () => {
    const container = containerRef.current;
    if (!container) return;

    // 1) 容器宽度 → 响应式列数切换（跳过首次挂载，让初始 columns 先到位）
    if (breakpoints && !firstMeasureRef.current) {
      const width = container.clientWidth;
      const fallback = columns ?? 4;
      const newCount = resolveColumnCount(width, breakpoints, fallback);
      logic.setColumnCount(newCount);
    }
    firstMeasureRef.current = false;

    // 2) 重新测量所有 item 高度（图片加载 / 内容变化都从这里进）
    for (const [key, el] of itemRefs.current) {
      logic.updateItemHeight(key, el.getBoundingClientRect().height);
    }
  };

  /** rAF 合并调度器：一帧内所有 ResizeObserver 回调合到一起 */
  const scheduleRaf = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      doMeasureAndLayout();
    });
  };

  // ---- 挂载两个 ResizeObserver ----
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // jsdom / 旧环境无 ResizeObserver：跳过监听，只做同步首次测量
    if (typeof ResizeObserver === 'undefined') {
      for (const [key, el] of itemRefs.current) {
        logic.updateItemHeight(key, el.getBoundingClientRect().height);
      }
      return;
    }

    // 容器宽度变化 → 响应式列数切换
    const containerRo = new ResizeObserver(() => scheduleRaf());
    containerRo.observe(container);

    // 全局 item 高度变化（图片加载 / 内容变化 / 布局完成）
    const itemRo = new ResizeObserver(() => scheduleRaf());

    // 延迟一帧：等 React 渲染完 item DOM 再 observe
    const frame = requestAnimationFrame(() => {
      itemRefs.current.forEach((el) => itemRo.observe(el));
      doMeasureAndLayout();
    });

    return () => {
      containerRo.disconnect();
      itemRo.disconnect();
      cancelAnimationFrame(frame);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [logic, breakpoints, columns]);

  // 同步 item observer：items 数组变化后 observe 新增的 DOM
  useLayoutEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;

    const itemRo = new ResizeObserver(() => scheduleRaf());
    itemRefs.current.forEach((el) => itemRo.observe(el));

    return () => itemRo.disconnect();
  }, [items]);

  // ---- 滚动位置（供虚拟滚动裁剪可视窗口用） ----
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRafRef = useRef<number | null>(null);

  // ---- 滚动监听：无限滚动 + 虚拟滚动裁剪 ----
  useEffect(() => {
    if (!height) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop: st, scrollHeight, clientHeight } = container;

      // 1) 无限滚动阈值触发（守卫 loading/finished）
      if (!loading && !finished && scrollHeight - st - clientHeight < loadMoreThreshold) {
        callbacksRef.current.onLoadMore?.();
      }

      // 2) 虚拟滚动：rAF 合并更新 scrollTop state（避免滚动事件高频 setState）
      if (virtual && scrollRafRef.current === null) {
        scrollRafRef.current = requestAnimationFrame(() => {
          scrollRafRef.current = null;
          setScrollTop(st);
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [height, virtual, loadMoreThreshold, loading, finished]);

  // 注册 item DOM 引用（React ref 回调）
  const registerItemRef = (key: string, el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(key, el);
    } else {
      itemRefs.current.delete(key);
    }
  };

  // key → index 反查表（handleItemClick 需要定位原始 item 对象）
  const keyToIndex = new Map<string, number>();
  items.forEach((item, i) => {
    keyToIndex.set(keyFor(item, rowKey, i), i);
  });

  const handleItemClick = (key: string) => {
    const idx = keyToIndex.get(key);
    if (idx === undefined) return;
    logic.handleItemClick(items[idx], idx);
  };

  // 渲染
  const hasItems = state.columns.some((col) => col.length > 0);

  // ---- 虚拟滚动：预先计算每列的可视窗口 ----
  const isVirtual = virtual && !!height;
  const viewportHeight =
    (typeof height === 'number' ? height : Number.parseFloat(height as string)) || 0;

  /** 每列的可视窗口（仅在 isVirtual 时有意义） */
  const columnsWindows: ColumnVirtualWindow[] = isVirtual
    ? state.columns.map((colKeys) => {
        const colHeights = colKeys.map((k) => state.itemHeights.get(k) ?? 0);
        const prefix = buildPrefixHeights(colHeights);
        // 用最新的 container clientHeight 兜底（scrollTop 已经在滚动时实时更新）
        const vh = containerRef.current?.clientHeight ?? viewportHeight;
        const windows = computeAllColumnsWindows([prefix], scrollTop, vh, 5);
        return windows[0]!;
      })
    : [];

  /** 无虚拟滚动的整列渲染（所有 item 全量渲染） */
  const renderColumnFull = (col: string[], colIdx: number) => (
    <div key={colIdx} className="xui-waterfall__column">
      {col.map((key) => renderItemNode(key))}
    </div>
  );

  /** 虚拟滚动裁剪渲染：topSpacer + [start, end) items + bottomSpacer */
  const renderColumnVirtual = (col: string[], colIdx: number) => {
    const w = columnsWindows[colIdx];
    if (!w) return null;
    return (
      <div key={colIdx} className="xui-waterfall__column">
        {w.topSpacer > 0 && <div style={{ height: w.topSpacer }} aria-hidden />}
        {col.slice(w.start, w.end).map((key) => renderItemNode(key))}
        {w.bottomSpacer > 0 && <div style={{ height: w.bottomSpacer }} aria-hidden />}
      </div>
    );
  };

  const renderItemNode = (key: string): ReactNode => {
    const idx = keyToIndex.get(key);
    const item = idx !== undefined ? items[idx] : undefined;
    return (
      <div
        key={key}
        ref={(el) => registerItemRef(key, el)}
        className="xui-waterfall__item"
        onClick={() => handleItemClick(key)}
      >
        {item && renderItem
          ? (renderItem as (item: WaterfallItem, index: number) => ReactNode)(item, idx ?? -1)
          : null}
        {!renderItem && <div className="xui-waterfall__item-placeholder" />}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'xui-waterfall',
        {
          'xui-waterfall--empty': !hasItems,
          'xui-waterfall--scrollable': !!height,
        },
        className,
      )}
      style={{
        ...style,
        ['--xui-waterfall-gutter' as string]: `${gutter}px`,
        ...(height !== undefined
          ? {
              height: typeof height === 'number' ? `${height}px` : height,
              overflowY: 'auto',
            }
          : {}),
      }}
    >
      {hasItems
        ? isVirtual
          ? state.columns.map(renderColumnVirtual)
          : state.columns.map(renderColumnFull)
        : null}
    </div>
  );
}
