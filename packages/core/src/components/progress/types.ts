/** Progress 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 进度条类型 */
export type ProgressType = 'line' | 'circle';

/** 进度状态：normal 正常色 / success 成功色 / error 失败色 */
export type ProgressStatus = 'normal' | 'success' | 'error';

/** Progress Props（Vue 与 React 共用） */
export type ProgressProps = {
  /** 进度百分比（0-100，越界自动收敛，非数值按 0 处理） */
  percent?: number;
  /** 进度条类型 */
  type?: ProgressType;
  /** 进度条粗细（px；circle 类型为 SVG 描边宽度） */
  strokeWidth?: number;
  /** 是否显示百分比文本 */
  showText?: boolean;
  /** 进度状态（percent 达到 100 且未显式指定 status/error 时派生为 success） */
  status?: ProgressStatus;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** Progress 事件契约（纯展示组件，无事件） */
export type ProgressEvents = Record<string, never>;

/** Progress 插槽契约 */
export type ProgressSlots = Record<string, never>;

/** Progress 状态快照（由逻辑层暴露） */
export type ProgressState = {
  /** 收敛到 [0, 100] 的进度百分比 */
  percent: number;
  /** 生效状态（含 percent >= 100 的 success 派生） */
  status: ProgressStatus;
  /** 生效粗细（px） */
  strokeWidth: number;
};

/** Progress 逻辑实例（通用接口；纯展示派生，无交互方法） */
export type ProgressLogic = LogicInstance<ProgressProps, ProgressState>;
