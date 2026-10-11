/** Button 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Button Props（Vue 与 React 共用） */
export type ButtonProps = {
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'danger' | 'link';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 禁用状态 */
  disabled?: boolean;
  /** 加载状态（ loading 时点击被忽略） */
  loading?: boolean;
  /** 是否块级元素（宽度撑满容器） */
  block?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 点击回调（由适配层桥接为框架事件） */
  onClick?: (event: MouseEvent) => void;
};

/** Button 事件契约 */
export type ButtonEvents = {
  click: (event: MouseEvent) => void;
};

/** Button 插槽契约 */
export type ButtonSlots = {
  /** 按钮内容 */
  default: Record<string, never>;
  /** 前置图标 */
  icon: Record<string, never>;
  /** 加载态图标（默认渲染 Spinner） */
  loadingIcon: Record<string, never>;
};

/** Button 状态快照（由逻辑层暴露） */
export type ButtonState = {
  disabled: boolean;
  loading: boolean;
};

/** Button 逻辑实例（通用接口 + 交互方法） */
export type ButtonLogic = LogicInstance<ButtonProps, ButtonState> & {
  handleClick: (event: MouseEvent) => void;
};
