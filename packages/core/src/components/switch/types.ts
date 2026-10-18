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
  /** 开启态展示文本（显示在轨道内滑块左侧；带文本时轨道宽度自适应较宽文本，不传保持纯开关模式） */
  checkedText?: string;
  /** 关闭态展示文本（显示在轨道内滑块右侧；带文本时轨道宽度自适应较宽文本，不传保持纯开关模式） */
  uncheckedText?: string;
  /** 开启态背景色（CSS 颜色值，通过 --xui-switch-checked-color 透传） */
  checkedColor?: string;
  /** 关闭态背景色（CSS 颜色值，通过 --xui-switch-unchecked-color 透传） */
  uncheckedColor?: string;
  /** 切换前钩子，返回 false 或 reject 的 Promise 可阻止切换 */
  beforeChange?: (value: boolean) => boolean | Promise<boolean>;
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

/** Switch 插槽契约 */
export type SwitchSlots = {
  /** 自定义加载图标（替换内置 loading spinner，内容为任意节点） */
  loadingIcon: Record<string, never>;
  /** 开启态滑块内图标（替换默认对勾） */
  checkedIcon: Record<string, never>;
  /** 关闭态滑块内图标（替换默认关闭图标） */
  uncheckedIcon: Record<string, never>;
};

/** Switch 状态快照（由逻辑层暴露） */
export type SwitchState = {
  /** 当前选中状态 */
  checked: boolean;
  disabled: boolean;
  loading: boolean;
};

/** Switch 逻辑实例（通用接口 + 交互方法） */
export type SwitchLogic = LogicInstance<SwitchProps, SwitchState> & {
  /** 切换选中状态（disabled / loading 时忽略；beforeChange 返回 false / reject 时中止） */
  toggle: () => void | Promise<void>;
};
