/** Skeleton 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Skeleton Props（Vue 与 React 共用） */
export type SkeletonProps = {
  /** 加载中状态（true 渲染骨架，false 渲染 default 插槽真实内容） */
  loading?: boolean;
  /** 是否显示头部头像占位 */
  avatar?: boolean;
  /** 段落行数 */
  rows?: number;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** Skeleton 事件契约（无契约事件） */
export type SkeletonEvents = Record<string, never>;

/** Skeleton 插槽契约 */
export type SkeletonSlots = {
  /** 真实内容（loading=false 时渲染） */
  default: Record<string, never>;
};

/** Skeleton 状态快照（由逻辑层暴露） */
export type SkeletonState = {
  loading: boolean;
  avatar: boolean;
  /** 收敛为正整数 */
  rows: number;
};

/** Skeleton 逻辑实例（纯展示组件，仅状态收敛与订阅） */
export type SkeletonLogic = LogicInstance<SkeletonProps, SkeletonState>;
