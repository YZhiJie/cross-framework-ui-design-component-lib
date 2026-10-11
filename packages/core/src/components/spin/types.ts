/** Spin 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 尺寸 */
export type SpinSize = 'sm' | 'md' | 'lg';

/** Spin Props（Vue 与 React 共用） */
export type SpinProps = {
  /** 尺寸 */
  size?: SpinSize;
  /** 加载中状态（包裹内容时控制遮罩显隐） */
  spinning?: boolean;
  /** 提示文案（显示在指示器下方） */
  tip?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** Spin 事件契约（无契约事件） */
export type SpinEvents = Record<string, never>;

/** Spin 插槽契约 */
export type SpinSlots = {
  /** 包裹内容（spinning 时覆盖半透明遮罩） */
  default: Record<string, never>;
};

/** Spin 状态快照（由逻辑层暴露） */
export type SpinState = {
  size: SpinSize;
  spinning: boolean;
  /** 空串归一为 null */
  tip: string | null;
};

/** Spin 逻辑实例（纯展示组件，仅状态收敛与订阅） */
export type SpinLogic = LogicInstance<SpinProps, SpinState>;
