/**
 * 响应式断点列数计算（纯函数）
 *
 * 输入视口宽度 + 断点数组，输出当前列数。
 * 不触碰 DOM / window，供 createWaterfallLogic 和适配层 ResizeObserver 回调复用。
 */

export type WaterfallBreakpoint = {
  minWidth: number;
  columns: number;
};

/**
 * 根据视口宽度和断点数组计算当前列数
 *
 * @param viewportWidth  当前视口或容器宽度（px）
 * @param breakpoints    断点数组（minWidth 升序最佳；未排序时自动排序）
 * @param fallback       所有断点都不命中时的回退列数（默认 2）
 * @returns 当前列数（clamp 到 [1, ∞)）
 */
export function resolveColumnCount(
  viewportWidth: number,
  breakpoints: WaterfallBreakpoint[],
  fallback = 2,
): number {
  if (!breakpoints || breakpoints.length === 0) {
    return Math.max(1, fallback);
  }

  // 拷贝并按 minWidth 升序排序（避免修改原数组）
  const sorted = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);

  // 找最后一个 minWidth <= viewportWidth 的断点
  // 例：breakpoints=[{400,2},{800,4},{1200,6}]，width=900 → 命中 {800,4}
  // 若所有 minWidth 都 > width（width < 400）→ fallback
  let result = sorted[0].columns;
  for (const bp of sorted) {
    if (bp.minWidth <= viewportWidth) {
      result = bp.columns;
    } else {
      break; // 已排好序，后续都更大
    }
  }

  return Math.max(1, result);
}
