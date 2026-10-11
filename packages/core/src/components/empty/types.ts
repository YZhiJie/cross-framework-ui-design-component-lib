/** Empty 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Empty Props（Vue 与 React 共用） */
export type EmptyProps = {
  /** 空状态描述文案（未提供或空白时不渲染描述，由外部决定文案以避免内置 i18n 问题） */
  description?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
};

/** Empty 事件契约（纯展示组件，无事件） */
export type EmptyEvents = Record<string, never>;

/** Empty 插槽契约 */
export type EmptySlots = {
  /** 底部动作区（如"去创建"按钮） */
  default: Record<string, never>;
  /** 自定义插画（覆盖默认插画） */
  image: Record<string, never>;
};

/** Empty 状态快照（由逻辑层暴露） */
export type EmptyState = {
  /** 归一化后的描述文案（undefined / 空白 → null） */
  description: string | null;
};

/** Empty 逻辑实例（通用接口；纯展示派生，无交互方法） */
export type EmptyLogic = LogicInstance<EmptyProps, EmptyState>;
