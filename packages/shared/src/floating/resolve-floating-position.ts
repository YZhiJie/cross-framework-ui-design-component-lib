/**
 * 浮层视口避让纯逻辑（Tooltip / Popconfirm / Select 共用）
 *
 * 不依赖任何框架与渲染方式：输入触发器 / 浮层的视口坐标矩形（DOMRect 结构兼容），
 * 输出最终方位（空间不足时向对侧翻转 flip）与交叉轴平移量（超出视口边缘时钳制 shift）。
 *
 * 定位模型沿用组件 CSS 包裹方案：
 * - top：浮层底边距触发器顶边 gap，水平居中
 * - bottom：浮层顶边距触发器底边 gap，水平居中
 * - left / right：垂直居中
 */

/** 四方位（与 core 契约的 placement 联合类型对齐） */
export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';

/** 视口坐标矩形（Pick<DOMRect, ...>，可直接传 getBoundingClientRect() 结果） */
export type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

/** 视口边界（视口坐标；整页场景即 0 / innerWidth / innerHeight / 0） */
export type FloatingViewport = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ResolveFloatingOptions = {
  /** 首选方位（由 placement prop 提供） */
  placement: FloatingPlacement;
  /** 触发器与浮层的间距（px，与 CSS 的 calc(100% + gap) 保持一致） */
  gap?: number;
  /** 浮层与视口边缘的最小安全距离（px） */
  viewportPadding?: number;
};

/** 避让计算结果 */
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

const DEFAULT_GAP = 8;
const DEFAULT_VIEWPORT_PADDING = 8;

/** 数值钳制 */
function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * 计算浮层相对视口的最终方位与交叉轴偏移。
 * 纯函数：相同输入必得相同输出，不读取 DOM，便于单测。
 */
export function resolveFloatingPosition(
  trigger: FloatingRect,
  popper: FloatingRect,
  viewport: FloatingViewport,
  options: ResolveFloatingOptions,
): FloatingPosition {
  const gap = options.gap ?? DEFAULT_GAP;
  const padding = options.viewportPadding ?? DEFAULT_VIEWPORT_PADDING;
  const preferred = options.placement;

  // 首选 / 对侧可用空间
  const spaceAbove = trigger.top - viewport.top;
  const spaceBelow = viewport.bottom - trigger.bottom;
  const spaceLeft = trigger.left - viewport.left;
  const spaceRight = viewport.right - trigger.right;

  const needVertical = popper.height + gap;
  const needHorizontal = popper.width + gap;

  let placement = preferred;

  // flip：首选方位放不下，且对侧空间更充足时翻转；两侧都不足时选空间较大的一侧
  if (preferred === 'top' && spaceAbove < needVertical && spaceBelow > spaceAbove) {
    placement = 'bottom';
  } else if (preferred === 'bottom' && spaceBelow < needVertical && spaceAbove > spaceBelow) {
    placement = 'top';
  } else if (preferred === 'left' && spaceLeft < needHorizontal && spaceRight > spaceLeft) {
    placement = 'right';
  } else if (preferred === 'right' && spaceRight < needHorizontal && spaceLeft > spaceRight) {
    placement = 'left';
  }

  // shift：居中对齐后向视口安全区钳制（交叉轴）
  let shift = 0;
  if (placement === 'top' || placement === 'bottom') {
    const idealLeft = trigger.left + (trigger.width - popper.width) / 2;
    const minLeft = viewport.left + padding;
    const maxLeft = viewport.right - padding - popper.width;
    shift = clamp(idealLeft, minLeft, Math.max(minLeft, maxLeft)) - idealLeft;
  } else {
    const idealTop = trigger.top + (trigger.height - popper.height) / 2;
    const minTop = viewport.top + padding;
    const maxTop = viewport.bottom - padding - popper.height;
    shift = clamp(idealTop, minTop, Math.max(minTop, maxTop)) - idealTop;
  }

  return { placement, shift };
}

/**
 * 获取当前视口边界（整页可视区域）。
 * SSR / 无 window 环境下降级为零矩形（计算结果等价于不翻转不偏移）。
 */
export function getViewport(): FloatingViewport {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  return {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
}
