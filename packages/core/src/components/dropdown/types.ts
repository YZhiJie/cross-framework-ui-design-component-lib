/** Dropdown 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 方位（与 floating 四方位对齐） */
export type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';

/** 触发方式：hover 悬停（默认，对齐主流生态）/ click 点击 */
export type DropdownTrigger = 'hover' | 'click';

/** 菜单项 */
export type DropdownOption = {
  /** 唯一标识（onSelect 回调与 Vue select 事件的载荷） */
  key: string;
  /** 文案 */
  label: string;
  /** 禁用（点击 no-op，不收起菜单） */
  disabled?: boolean;
  /** 危险项（红色文案，语义不变） */
  danger?: boolean;
  /** 分隔线（顶部留白 + 上边框） */
  divided?: boolean;
  /** 图标名（@xui-design/icons 的 IconName，未知名忽略不渲染） */
  icon?: string;
};

/** Dropdown Props（Vue 与 React 共用） */
export type DropdownProps = {
  /** 菜单项数组 */
  menu: DropdownOption[];
  /** 触发方式 */
  trigger?: DropdownTrigger;
  /** 菜单方位 */
  placement?: DropdownPlacement;
  /** 禁用状态（禁用后触发无效，运行时禁用收起已开菜单） */
  disabled?: boolean;
  /** 自定义类名（应用于触发器包裹根元素） */
  className?: string;
  /** 自定义内联样式（应用位置同 className） */
  style?: Record<string, string>;
  /** 菜单项点击回调（菜单收起后触发；禁用项不触发） */
  onSelect?: (key: string, option: DropdownOption) => void;
  /** 菜单展开 / 收起回调 */
  onVisibleChange?: (open: boolean) => void;
};

/** Dropdown 事件契约 */
export type DropdownEvents = {
  select: (key: string, option: DropdownOption) => void;
  visibleChange: (open: boolean) => void;
};

/** Dropdown 插槽契约 */
export type DropdownSlots = {
  /** 触发元素 */
  default: Record<string, never>;
};

/** Dropdown 状态快照（由逻辑层暴露） */
export type DropdownState = {
  open: boolean;
  placement: DropdownPlacement;
  trigger: DropdownTrigger;
  disabled: boolean;
};

/** Dropdown 逻辑实例（通用接口 + 交互方法） */
export type DropdownLogic = LogicInstance<DropdownProps, DropdownState> & {
  /** 触发元素点击切换（仅 trigger='click' 生效；disabled no-op） */
  toggle: () => void;
  /** 立即展开（hover 触发 / 命令式 show） */
  openMenu: () => void;
  /** 立即收起（外部点击 / Esc / 命令式 hide） */
  closeMenu: () => void;
  /** 触发元素 mouseenter：hover 触发时延迟展开 */
  handleTriggerEnter: () => void;
  /** 触发元素 mouseleave：hover 触发时延迟收起 */
  handleTriggerLeave: () => void;
  /** 菜单 mouseenter：取消待执行的收起（跨 8px 间隙防抖） */
  handlePopperEnter: () => void;
  /** 菜单 mouseleave：延迟收起 */
  handlePopperLeave: () => void;
  /** 菜单项点击：禁用项 no-op；否则收起并回调 onSelect */
  select: (key: string) => void;
  /** 点击外部收起（不触发 onSelect） */
  close: () => void;
};
