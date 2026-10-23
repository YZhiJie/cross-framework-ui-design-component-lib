/**
 * Waterfall 可变高度虚拟滚动逻辑（独立文件，不改动 create-virtual-list-logic.ts）
 *
 * 核心思路：
 *  - 输入：每列的累积高度数组 + 当前 scrollTop + 容器高度
 *  - 输出：每列的可视窗口 [start, end] 索引（含 overscan 缓冲）
 *  - 纯函数 + 二分查找；item 高度由上层 Waterfall 逻辑层管理，这里只负责可视裁剪
 *
 * 与固定行高版本（create-virtual-list-logic.ts）的关键差异：
 *  - 每行高度不等，必须维护 prefix-sum 累积数组
 *  - 每列独立做二分查找（瀑布流多列高度不同）
 *  - 不依赖"行高 uniform"假设，也不提供 item 定位功能
 */

/** 某一列的累积高度 + 可视窗口 */
export type ColumnVirtualWindow = {
  /** 当前列所有 item 的累积高度（prefix sums，长度 = 该列 item 数） */
  prefixHeights: number[];
  /** 可视起始索引（含 overscan 缓冲） */
  start: number;
  /** 可视结束索引（exclusive，含 overscan 缓冲） */
  end: number;
  /** 上半部分隐藏内容的总高度（给 DOM 占位用） */
  topSpacer: number;
  /** 下半部分隐藏内容的总高度（给 DOM 占位用） */
  bottomSpacer: number;
};

/**
 * 计算单列的累积高度数组
 *
 * @param itemHeights 该列每个 item 的高度数组（已测量）
 * @returns prefixHeights[i] = itemHeights[0..i) 的和；数组长度 = itemHeights.length
 */
export function buildPrefixHeights(itemHeights: number[]): number[] {
  const result = new Array<number>(itemHeights.length);
  let acc = 0;
  for (let i = 0; i < itemHeights.length; i++) {
    acc += itemHeights[i];
    result[i] = acc;
  }
  return result;
}

/**
 * 在 prefixHeights 中二分查找第一个 >= target 的索引
 * （prefixHeights 严格递增，除非有 0 高度 item）
 *
 * @returns -1 表示所有累积高度都 < target（target 超过总高度）
 */
function findFirstGE(prefixHeights: number[], target: number): number {
  if (prefixHeights.length === 0) return -1;
  let lo = 0;
  let hi = prefixHeights.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (prefixHeights[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo === prefixHeights.length ? -1 : lo;
}

/**
 * 计算单列的虚拟滚动可视窗口
 *
 * @param prefixHeights 该列累积高度数组（由 buildPrefixHeights 生成）
 * @param scrollTop     当前滚动容器的 scrollTop
 * @param viewportHeight 滚动容器可视高度
 * @param overscan      上下各多渲染的缓冲 item 数（默认 5）
 * @returns ColumnVirtualWindow
 */
export function computeColumnWindow(
  prefixHeights: number[],
  scrollTop: number,
  viewportHeight: number,
  overscan = 5,
): ColumnVirtualWindow {
  const totalCount = prefixHeights.length;
  if (totalCount === 0) {
    return { prefixHeights: [], start: 0, end: 0, topSpacer: 0, bottomSpacer: 0 };
  }

  // 上边界：滚动到第一个可见 item
  // 我们需要找到 prefixHeights[i] 第一个 > scrollTop 的位置 i → 就是可见起始
  // 但更精确的是：item i 覆盖的高度段是 [i==0 ? 0 : prefixHeights[i-1], prefixHeights[i])
  // 所以"第一个被 scrollTop 触及的 item" = findFirstGE(prefixHeights, scrollTop)
  const rawStart = findFirstGE(prefixHeights, scrollTop);
  // 下边界：最后一个可见 item = findFirstGE(prefixHeights, scrollTop + viewportHeight)
  let rawEnd = findFirstGE(prefixHeights, scrollTop + viewportHeight);
  if (rawEnd === -1) rawEnd = totalCount; // 全部可见或滚到底

  // 加 overscan 缓冲
  const start = Math.max(0, rawStart - overscan);
  const end = Math.min(totalCount, rawEnd + overscan);

  // spacer 计算
  const topSpacer = start === 0 ? 0 : prefixHeights[start - 1];
  const bottomSpacer =
    end === totalCount ? 0 : prefixHeights[totalCount - 1] - (end === 0 ? 0 : prefixHeights[end - 1]);

  return { prefixHeights, start, end, topSpacer, bottomSpacer };
}

/**
 * 一次性计算多列的可视窗口
 *
 * @param columnsPrefixHeights 每列的累积高度数组（由上层先 buildPrefixHeights）
 * @param scrollTop            当前 scrollTop
 * @param viewportHeight       容器可视高度
 * @param overscan             缓冲 item 数
 * @returns 每列的 ColumnVirtualWindow
 */
export function computeAllColumnsWindows(
  columnsPrefixHeights: number[][],
  scrollTop: number,
  viewportHeight: number,
  overscan = 5,
): ColumnVirtualWindow[] {
  return columnsPrefixHeights.map((ph) =>
    computeColumnWindow(ph, scrollTop, viewportHeight, overscan),
  );
}
