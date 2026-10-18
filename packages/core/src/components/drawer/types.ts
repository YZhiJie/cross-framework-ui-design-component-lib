/**
 * Drawer 契约类型
 *
 * Props / Events / Slots / State / Logic
 */

import type { LogicInstance } from '../../types';

/** 抽屉方向 */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/** Drawer Props（Vue 与 React 共用） */
export type DrawerProps = {
  /** 受控可见性（变更时由适配层同步给逻辑层） */
  visible?: boolean;
  /** 非受控初始可见性 */
  defaultVisible?: boolean;
  /** 抽屉方向（默认 'right'） */
  placement?: DrawerPlacement;
  /** 尺寸：left/right 时为宽度，top/bottom 时为高度（数字按 px，字符串原样输出，默认 378） */
  size?: number | string;
  /** 标题 */
  title?: string;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 是否显示遮罩（默认 true；关闭时抽屉直接吸附在视口边缘） */
  mask?: boolean;
  /** 点击遮罩是否关闭（mask 关闭时不生效） */
  maskClosable?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnEsc?: boolean;
  /** 打开时是否将 Tab 焦点循环约束在抽屉内（默认 true） */
  trapFocus?: boolean;
  /** 自定义类名（应用于抽屉面板，对齐 Modal 约定） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
  onOpen?: () => void;
  onClose?: () => void;
};

/** Drawer 事件契约 */
export type DrawerEvents = {
  open: () => void;
  close: () => void;
};

/** Drawer 插槽契约 */
export type DrawerSlots = {
  /** 抽屉内容 */
  default: Record<string, never>;
  /** 标题（覆盖 title prop） */
  title: Record<string, never>;
  /** 底部操作区 */
  footer: Record<string, never>;
  /** 自定义关闭图标（替换右上角内置 close，内容为任意节点） */
  closeIcon: Record<string, never>;
};

/** Drawer 状态快照（由逻辑层暴露） */
export type DrawerState = {
  visible: boolean;
  closable: boolean;
};

/** Drawer 逻辑实例（通用接口 + 交互方法） */
export type DrawerLogic = LogicInstance<DrawerProps, DrawerState> & {
  open: () => void;
  close: () => void;
  toggle: () => void;
  handleMaskClick: () => void;
  handleEsc: () => void;
};
