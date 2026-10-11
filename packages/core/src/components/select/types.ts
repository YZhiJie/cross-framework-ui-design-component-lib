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

/** Select 选中值：单选为 string，多选为 string[] */
export type SelectValue = string | string[];

/** Select Props（Vue 与 React 共用） */
export type SelectProps = {
  /** 受控选中值（提供即受控）；多选模式为 string[] */
  value?: SelectValue;
  /** 非受控初始选中值 */
  defaultValue?: SelectValue;
  /** 选项数组 */
  options: SelectOption[];
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时；多选模式清空全部） */
  clearable?: boolean;
  /** 多选模式：选中值为数组，点击选项切换选中且面板不关闭 */
  multiple?: boolean;
  /** 可搜索模式：面板顶部显示搜索框，按选项文案过滤 */
  searchable?: boolean;
  /** 虚拟滚动模式（大数据量选项；需配合 maxHeight 固定面板视口高） */
  virtual?: boolean;
  /** 下拉面板最大高度（px，默认 264；虚拟模式下即视口高度） */
  maxHeight?: number;
  /** 附加到根节点的自定义类名 */
  className?: string;
  /** 附加到根节点的内联样式（支持 CSS 自定义属性） */
  style?: Record<string, string>;
  /** 选中值变更回调（契约事件；多选时载荷为 string[]） */
  onChange?: (value: SelectValue) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};

/** Select 事件契约 */
export type SelectEvents = {
  change: (value: SelectValue) => void;
  clear: () => void;
};

/** Select 插槽契约 */
export type SelectSlots = Record<string, never>;

/** Select 状态快照（由逻辑层暴露） */
export type SelectState = {
  /** 当前选中值：单选 string | null；多选 string[]（空数组表示未选中） */
  value: string | string[] | null;
  /** 下拉面板展开状态 */
  open: boolean;
  /** 键盘高亮项下标（-1 表示无高亮；作用于过滤后列表） */
  activeIndex: number;
  disabled: boolean;
  /** 当前搜索词（searchable 模式） */
  searchQuery: string;
  /** 过滤后的选项列表（非 searchable 恒等于 options） */
  filteredOptions: SelectOption[];
};

/** Select 逻辑实例（通用接口 + 交互方法） */
export type SelectLogic = LogicInstance<SelectProps, SelectState> & {
  /** 展开 / 收起下拉面板（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板并重置搜索状态 */
  close: () => void;
  /** 选中指定值：disabled 选项忽略；单选为选中语义，多选为切换语义；受控仅回调 */
  select: (value: string) => void;
  /** 清空选中值（clearable 模式下点击清除图标；非受控重置，始终触发 clear） */
  clear: () => void;
  /** 键盘移动高亮项（+1 / -1，跳过禁用项；作用于过滤后列表） */
  moveHighlight: (delta: 1 | -1) => void;
  /** 确认当前高亮项（无高亮时忽略） */
  confirmHighlight: () => void;
  /** 更新搜索词并重算过滤列表（仅 searchable 模式生效） */
  setSearch: (query: string) => void;
};
