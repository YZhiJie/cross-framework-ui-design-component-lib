/** Switch 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Switch Props（Vue 与 React 共用） */
export type SwitchProps = {
  /** 受控选中状态（提供时进入受控模式） */
  value?: boolean;
  /** 非受控初始状态 */
  defaultValue?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 禁用状态 */
  disabled?: boolean;
  /** 加载状态（切换被忽略） */
  loading?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 状态变更回调（载荷为切换后的选中值） */
  onChange?: (value: boolean) => void;
};

/** Switch 事件契约 */
export type SwitchEvents = {
  change: (value: boolean) => void;
};

/** Switch 插槽契约（无插槽） */
export type SwitchSlots = Record<string, never>;

/** Switch 状态快照（由逻辑层暴露） */
export type SwitchState = {
  /** 当前选中状态 */
  checked: boolean;
  disabled: boolean;
  loading: boolean;
};

/** Switch 逻辑实例（通用接口 + 交互方法） */
export type SwitchLogic = LogicInstance<SwitchProps, SwitchState> & {
  /** 切换选中状态（disabled / loading 时忽略） */
  toggle: () => void;
};
