/** Alert 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Alert Props（Vue 与 React 共用） */
export type AlertProps = {
  /** 语义类型 */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** 标题 */
  title?: string;
  /** 辅助描述（default 插槽的回退内容） */
  description?: string;
  /** 是否可关闭（显示关闭按钮，点击后隐藏并触发 close） */
  closable?: boolean;
  /** 是否显示类型图标 */
  showIcon?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 关闭回调（组件隐藏后触发） */
  onClose?: () => void;
};

/** Alert 事件契约 */
export type AlertEvents = {
  close: () => void;
};

/** Alert 插槽契约 */
export type AlertSlots = {
  /** 描述内容（覆盖 description prop） */
  default: Record<string, never>;
  /** 标题（覆盖 title prop） */
  title: Record<string, never>;
  /** 类型图标（覆盖默认图标，showIcon 开启时生效） */
  icon: Record<string, never>;
  /** 自定义关闭图标（替换内置 close，内容为任意节点） */
  closeIcon: Record<string, never>;
};

/** Alert 状态快照（由逻辑层暴露） */
export type AlertState = {
  /** 是否可见（closable 关闭后变为 false） */
  visible: boolean;
  closable: boolean;
};

/** Alert 逻辑实例（通用接口 + 交互方法） */
export type AlertLogic = LogicInstance<AlertProps, AlertState> & {
  /** 关闭处理：隐藏提示并触发 close 回调 */
  handleClose: () => void;
};
