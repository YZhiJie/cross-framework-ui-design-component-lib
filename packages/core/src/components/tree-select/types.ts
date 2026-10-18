/** TreeSelect 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：
 * - 单选（默认）：value 为节点 key（string），点击节点即选中并收起面板；
 * - 多选（multiple=true）：value 为 string[]，面板内渲染勾选框并支持级联勾选，
 *   点击节点切换勾选且面板保持展开；标签移除复用 toggleCheck 语义。
 */

import type { LogicInstance } from '../../types';
import type { TreeNode } from '../tree/types';

/** TreeSelect 选中值：单选为 string，多选为 string[] */
export type TreeSelectValue = string | string[];

/** TreeSelect Props（Vue 与 React 共用） */
export type TreeSelectProps = {
  /** 受控选中值（提供即受控）；多选模式为 string[] */
  value?: TreeSelectValue;
  /** 非受控初始选中值 */
  defaultValue?: TreeSelectValue;
  /** 树形数据（结构同 Tree 组件的 data） */
  treeData: TreeNode[];
  /** 多选模式：勾选框 + 级联勾选，value 为 string[]，面板保持展开 */
  multiple?: boolean;
  /** 多选模式下勾选父子独立（true 时不做级联勾选与勾选态推导） */
  checkStrictly?: boolean;
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时；多选模式清空全部） */
  clearable?: boolean;
  /** 非受控模式下默认展开全部节点 */
  defaultExpandAll?: boolean;
  /** 附加到根节点的自定义类名 */
  className?: string;
  /** 附加到根节点的内联样式（支持 CSS 自定义属性） */
  style?: Record<string, string>;
  /** 选中值变更回调（契约事件；多选时载荷为 string[]） */
  onChange?: (value: TreeSelectValue) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};

/** TreeSelect 事件契约 */
export type TreeSelectEvents = {
  change: (value: TreeSelectValue) => void;
  clear: () => void;
};

/** TreeSelect 插槽契约 */
export type TreeSelectSlots = {
  /** 自定义清除图标（替换触发器与多选标签的内置 clear 图标，内容为任意节点） */
  clearIcon: Record<string, never>;
  /** 自定义下拉箭头图标（替换内置 arrow-down，内容为任意节点） */
  suffixIcon: Record<string, never>;
};

/** TreeSelect 状态快照（由逻辑层暴露） */
export type TreeSelectState = {
  /** 当前选中值：单选 string | null；多选 string[]（空数组表示未选中） */
  value: string | string[] | null;
  /** 下拉面板展开状态 */
  open: boolean;
  /** 当前展开的节点 keys（面板内树渲染用） */
  expandedKeys: string[];
  /** 单选选中 key（null 表示未选中；多选模式恒为 null） */
  selectedKey: string | null;
  /** 多选勾选 keys（单选模式恒为空数组） */
  checkedKeys: string[];
  disabled: boolean;
};

/** TreeSelect 逻辑实例（通用接口 + 交互方法） */
export type TreeSelectLogic = LogicInstance<TreeSelectProps, TreeSelectState> & {
  /** 展开 / 收起面板（disabled 时忽略） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
  /** 展开 / 收起节点（叶子与 disabled 节点忽略） */
  toggleExpand: (key: string) => void;
  /** 单选：选中节点并收起面板（disabled 节点忽略；受控仅回调） */
  selectNode: (key: string) => void;
  /** 多选：切换节点勾选状态（默认级联，checkStrictly 时仅切换自身）；受控仅回调 */
  toggleCheck: (key: string) => void;
  /** 清空选中值（clearable 模式下点击清除图标；非受控重置，始终触发 clear） */
  clear: () => void;
  /** 查询节点是否展开 */
  isExpanded: (key: string) => boolean;
  /** 查询节点勾选状态（父级由后代叶子勾选情况推导） */
  getCheckState: (key: string) => { checked: boolean; indeterminate: boolean };
};
