/** Badge 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Badge Props（Vue 与 React 共用） */
export type BadgeProps = {
  /** 徽标数值（未提供时不显示；dot 模式下仅作为无障碍语义参考） */
  count?: number;
  /** 数值上限（超出显示 `${max}+`） */
  max?: number;
  /** 点状徽标（忽略 count 与 max，仅显示小红点） */
  dot?: boolean;
  /** count 为 0 时是否显示徽标（默认隐藏） */
  showZero?: boolean;
};

/** Badge 事件契约（纯展示组件，无事件） */
export type BadgeEvents = Record<string, never>;

/** Badge 插槽契约 */
export type BadgeSlots = {
  /** 徽标包裹的内容（未提供时徽标独立渲染） */
  default: Record<string, never>;
};

/** Badge 状态快照（由逻辑层暴露） */
export type BadgeState = {
  /** 是否显示徽标 */
  visible: boolean;
  /** 徽标文本（dot 模式为 null） */
  text: string | null;
};

/** Badge 逻辑实例（通用接口；纯展示派生，无交互方法） */
export type BadgeLogic = LogicInstance<BadgeProps, BadgeState>;
