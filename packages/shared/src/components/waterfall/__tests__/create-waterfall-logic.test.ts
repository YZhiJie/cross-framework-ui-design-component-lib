// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { resolveColumnCount } from '../create-breakpoint-logic';
import { createWaterfallLogic, shortestColumnAssign } from '../create-waterfall-logic';

// ---------- resolveColumnCount ----------

describe('resolveColumnCount', () => {
  it('空断点 → fallback', () => {
    expect(resolveColumnCount(1024, [])).toBe(2);
    expect(resolveColumnCount(1024, [], 5)).toBe(5);
  });

  it('自动按 minWidth 升序排序', () => {
    // 传入降序
    const result = resolveColumnCount(900, [
      { minWidth: 1200, columns: 6 },
      { minWidth: 400, columns: 2 },
      { minWidth: 800, columns: 4 },
    ]);
    expect(result).toBe(4); // 命中 {800, 4}
  });

  it('命中最后一个断点', () => {
    const result = resolveColumnCount(1400, [
      { minWidth: 400, columns: 2 },
      { minWidth: 800, columns: 4 },
      { minWidth: 1200, columns: 6 },
    ]);
    expect(result).toBe(6);
  });

  it('viewportWidth 正好等于 minWidth → 命中', () => {
    expect(
      resolveColumnCount(800, [
        { minWidth: 400, columns: 2 },
        { minWidth: 800, columns: 4 },
      ]),
    ).toBe(4);
  });

  it('所有断点都不命中（viewport 小于最小 minWidth）→ 回退首项 columns', () => {
    expect(
      resolveColumnCount(200, [
        { minWidth: 400, columns: 2 },
        { minWidth: 800, columns: 4 },
      ]),
    ).toBe(2); // sorted 后首项的 columns
  });

  it('clamp 到至少 1 列', () => {
    expect(resolveColumnCount(1024, [{ minWidth: 0, columns: 0 }])).toBe(1);
  });
});

// ---------- shortestColumnAssign ----------

describe('shortestColumnAssign', () => {
  it('等高分配：均匀分布到各列', () => {
    const heights = new Map<string, number>();
    // 6 个 item 等高 100px，分到 3 列 → 每列 2 个
    const itemKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
    for (const k of itemKeys) heights.set(k, 100);

    const { columns, columnHeights } = shortestColumnAssign(itemKeys, heights, 3);

    expect(columns).toHaveLength(3);
    expect(columns.map((c) => c.length)).toEqual([2, 2, 2]);
    expect(columnHeights).toEqual([200, 200, 200]);
  });

  it('不等高：每一步都选当时最短的列（贪心，不保证全局最优）', () => {
    const heights = new Map<string, number>([
      ['a', 500],
      ['b', 100],
      ['c', 400],
      ['d', 200],
      ['e', 300],
    ]);
    const itemKeys = ['a', 'b', 'c', 'd', 'e'];
    const { columns, columnHeights } = shortestColumnAssign(itemKeys, heights, 3);

    expect(columns).toHaveLength(3);

    // 贪心验证：最终各列高度差 <= 最高单项高度（说明没有哪个 item 被放进过比它能放的最短列更长的列）
    const maxH = 500;
    const maxDiff = Math.max(...columnHeights) - Math.min(...columnHeights);
    expect(maxDiff).toBeLessThanOrEqual(maxH);

    // 关键断言：没有哪一列的高度 > 所有 item 总高度的 1/3 + 最高单项
    // 总高度 = 1500，理想均分 500，允许偏差 500（一项的高度）
    const totalH = 1500;
    for (const h of columnHeights) {
      expect(h).toBeLessThanOrEqual(totalH / 3 + maxH);
    }
  });

  it('空数组 → 全部空列，高度为 0', () => {
    const { columns, columnHeights } = shortestColumnAssign([], new Map(), 3);
    expect(columns).toEqual([[], [], []]);
    expect(columnHeights).toEqual([0, 0, 0]);
  });

  it('clamp 到至少 1 列', () => {
    const { columns, columnHeights } = shortestColumnAssign(['a'], new Map([['a', 50]]), 0);
    expect(columns).toHaveLength(1);
    expect(columnHeights).toEqual([50]);
  });
});

// ---------- createWaterfallLogic ----------

describe('createWaterfallLogic', () => {
  function makeItems(n: number) {
    return Array.from({ length: n }, (_, i) => ({ id: i, title: `item-${i}` }));
  }

  it('初始状态：列数 = columns 默认值，所有 item 平分', () => {
    const items = makeItems(8);
    const logic = createWaterfallLogic({ items, columns: 4 });
    const state = logic.getState();
    expect(state.columnCount).toBe(4);
    // 8 个 item 未测量高度（都是 0），等高分配 → 每列 2 个
    expect(state.columns.map((c) => c.length)).toEqual([2, 2, 2, 2]);
  });

  it('setColumnCount：列数变化 → 重排 + 通知', () => {
    const items = makeItems(8);
    const listener = vi.fn();
    const logic = createWaterfallLogic({ items, columns: 4 });
    logic.subscribe(listener);

    logic.setColumnCount(2);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(logic.getState().columnCount).toBe(2);
    expect(logic.getState().columns.map((c) => c.length)).toEqual([4, 4]);
  });

  it('setColumnCount 相同值 → 不触发', () => {
    const listener = vi.fn();
    const logic = createWaterfallLogic({ items: makeItems(4), columns: 2 });
    logic.subscribe(listener);

    logic.setColumnCount(2);
    expect(listener).not.toHaveBeenCalled();
  });

  it('updateItemHeight → 重排 + 通知', () => {
    const items = makeItems(4);
    const listener = vi.fn();
    const logic = createWaterfallLogic({ items, columns: 2 });
    logic.subscribe(listener);

    // 设置第一个 item 的高度远大于其他
    logic.updateItemHeight('0', 1000);

    expect(listener).toHaveBeenCalledTimes(1);
    // item-0 很高，应该独占一列，其他三个 item 按最短列分配
    const state = logic.getState();
    expect(state.columnHeights[0] === 1000 || state.columnHeights[1] === 1000).toBe(true);
  });

  it('updateItemHeight 相同高度 → 跳过', () => {
    const items = makeItems(4);
    const listener = vi.fn();
    const logic = createWaterfallLogic({ items, columns: 2 });
    logic.subscribe(listener);

    logic.updateItemHeight('0', 200);
    listener.mockClear();

    logic.updateItemHeight('0', 200);
    expect(listener).not.toHaveBeenCalled();
  });

  it('updateOptions items 变化 → 重排', () => {
    const listener = vi.fn();
    const logic = createWaterfallLogic({ items: makeItems(4), columns: 2 });
    logic.subscribe(listener);

    const newItems = makeItems(6);
    logic.updateOptions({ items: newItems });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(logic.getState().columns.flat()).toHaveLength(6);
  });

  it('handleItemClick → 触发 onItemClick 回调', () => {
    const onItemClick = vi.fn();
    const logic = createWaterfallLogic({
      items: makeItems(3),
      rowKey: 'id',
      columns: 2,
      onItemClick,
    });

    logic.handleItemClick({ id: 42 }, 2);
    expect(onItemClick).toHaveBeenCalledWith({ id: 42 }, 2);
  });

  it('onLayoutChange 在重排时触发', () => {
    const onLayoutChange = vi.fn();
    const logic = createWaterfallLogic({
      items: makeItems(4),
      columns: 2,
      gutter: 12,
      onLayoutChange,
    });

    // 初始布局也应触发
    expect(onLayoutChange).toHaveBeenCalledTimes(1);
    expect(onLayoutChange).toHaveBeenCalledWith({
      columnCount: 2,
      columnHeights: expect.any(Array),
      gutter: 12,
    });

    // 列数变化 → 再次触发
    onLayoutChange.mockClear();
    logic.setColumnCount(3);
    expect(onLayoutChange).toHaveBeenCalledTimes(1);
    expect(onLayoutChange).toHaveBeenCalledWith({
      columnCount: 3,
      columnHeights: expect.any(Array),
      gutter: 12,
    });
  });

  it('高度缓存跨列数切换复用，不丢失', () => {
    const items = makeItems(6);
    const logic = createWaterfallLogic({ items, columns: 3 });

    // 先给所有 item 设高度
    for (let i = 0; i < 6; i++) {
      logic.updateItemHeight(String(i), 100 + i * 50); // 100, 150, 200, 250, 300, 350
    }
    const heightsBefore = logic.getState().columnHeights;

    // 切换到 2 列 → 应基于同一组缓存高度重新分配
    logic.setColumnCount(2);
    const heightsAfter = logic.getState().columnHeights;

    // 6 个 item 总高度 = 1050px，2 列应该比 3 列更均匀（差值更小）
    const maxDiff2 = Math.abs(heightsAfter[0] - heightsAfter[1]);
    const maxDiff3 = Math.max(...heightsBefore) - Math.min(...heightsBefore);
    expect(maxDiff2).toBeLessThanOrEqual(maxDiff3);
  });

  it('rowKey 自定义：用指定字段作为唯一键', () => {
    const items = [
      { uid: 'a', h: 100 },
      { uid: 'b', h: 200 },
    ];
    const logic = createWaterfallLogic({ items, rowKey: 'uid', columns: 1 });

    logic.updateItemHeight('a', 100);
    logic.updateItemHeight('b', 200);

    expect(logic.getState().columns[0]).toEqual(['a', 'b']);
  });
});
