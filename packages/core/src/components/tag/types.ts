/** Tag 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Tag Props（Vue 与 React 共用） */
export type TagProps = {
  /** 语义类型 */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 是否可关闭（显示关闭按钮，点击后隐藏标签并触发 close） */
  closable?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 关闭回调（组件隐藏后触发） */
  onClose?: () => void;
};

/** Tag 事件契约 */
export type TagEvents = {
  close: () => void;
};

/** Tag 插槽契约 */
export type TagSlots = {
  /** 标签内容 */
  default: Record<string, never>;
  /** 自定义关闭图标（替换内置 close，内容为任意节点） */
  closeIcon: Record<string, never>;
};

/** Tag 状态快照（由逻辑层暴露） */
export type TagState = {
  /** 是否可见（closable 关闭后变为 false） */
  visible: boolean;
  closable: boolean;
};

/** Tag 逻辑实例（通用接口 + 交互方法） */
export type TagLogic = LogicInstance<TagProps, TagState> & {
  /** 关闭处理：隐藏标签并触发 close 回调 */
  handleClose: () => void;
};
