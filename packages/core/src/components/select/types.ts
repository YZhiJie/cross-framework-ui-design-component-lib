/** Select 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 下拉选项 */
export type SelectOption = {
  /** 选项文案 */
  label: string;
  /** 选项值（组内唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

/** Select Props（Vue 与 React 共用） */
export type SelectProps = {
  /** 受控选中值（提供即受控） */
  value?: string;
  /** 非受控初始选中值 */
  defaultValue?: string;
  /** 选项数组 */
  options: SelectOption[];
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时） */
  clearable?: boolean;
  /** 选中值变更回调（契约事件） */
  onChange?: (value: string) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};

/** Select 事件契约 */
export type SelectEvents = {
  change: (value: string) => void;
  clear: () => void;
};

/** Select 插槽契约 */
export type SelectSlots = Record<string, never>;

/** Select 状态快照（由逻辑层暴露） */
export type SelectState = {
  /** 当前选中值（null 表示未选中） */
  value: string | null;
  /** 下拉面板展开状态 */
  open: boolean;
  /** 键盘高亮项下标（-1 表示无高亮） */
  activeIndex: number;
  disabled: boolean;
};

/** Select 逻辑实例（通用接口 + 交互方法） */
export type SelectLogic = LogicInstance<SelectProps, SelectState> & {
  /** 展开 / 收起下拉面板（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起下拉面板 */
  close: () => void;
  /** 选中指定值：disabled 选项忽略；非受控更新 value；受控仅回调 */
  select: (value: string) => void;
  /** 清空选中值（clearable 模式下点击清除图标；非受控置 null，始终触发 clear） */
  clear: () => void;
  /** 键盘移动高亮项（+1 / -1，跳过禁用项） */
  moveHighlight: (delta: 1 | -1) => void;
  /** 确认当前高亮项（无高亮时忽略） */
  confirmHighlight: () => void;
};
