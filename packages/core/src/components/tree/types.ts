/** Tree 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：节点 key 在全树范围内唯一；
 * 非叶子节点的 children 为空数组时视为叶子。
 */

import type { LogicInstance } from '../../types';

/** 树节点（树形结构） */
export type TreeNode = {
  /** 节点唯一标识（全树唯一） */
  key: string;
  /** 节点文案 */
  label: string;
  /** 子节点（存在且非空时表示非叶子节点） */
  children?: TreeNode[];
  /** 禁用本节点（不可选中/勾选/展开） */
  disabled?: boolean;
  /** 仅禁用勾选框（节点本身仍可展开/选中） */
  disableCheckbox?: boolean;
};

/** Tree Props（Vue 与 React 共用） */
export type TreeProps = {
  /** 树形数据 */
  data: TreeNode[];
  /** 受控展开的 key 列表（提供即受控） */
  expandedKeys?: string[];
  /** 非受控初始展开的 key 列表 */
  defaultExpandedKeys?: string[];
  /** 受控勾选的 key 列表（提供即受控；仅 checkable 时生效） */
  checkedKeys?: string[];
  /** 非受控初始勾选的 key 列表 */
  defaultCheckedKeys?: string[];
  /** 受控选中的 key（提供即受控；null 表示未选中） */
  selectedKey?: string | null;
  /** 非受控初始选中的 key */
  defaultSelectedKey?: string | null;
  /** 是否显示勾选框（开启后节点前渲染 checkbox，支持级联勾选） */
  checkable?: boolean;
  /** 勾选父子独立（true 时不做级联勾选与勾选态推导） */
  checkStrictly?: boolean;
  /** 非受控模式下默认展开全部节点 */
  defaultExpandAll?: boolean;
  /** 禁用整棵树 */
  disabled?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 展开状态变更回调 */
  onExpand?: (expandedKeys: string[], info: { key: string; expanded: boolean }) => void;
  /** 勾选状态变更回调 */
  onCheck?: (checkedKeys: string[], info: { key: string; checked: boolean }) => void;
  /** 选中状态变更回调 */
  onSelect?: (selectedKey: string | null, info: { key: string }) => void;
};

/** Tree 事件契约 */
export type TreeEvents = {
  expand: (expandedKeys: string[], info: { key: string; expanded: boolean }) => void;
  check: (checkedKeys: string[], info: { key: string; checked: boolean }) => void;
  select: (selectedKey: string | null, info: { key: string }) => void;
};

/** Tree 插槽契约 */
export type TreeSlots = {
  /** 自定义节点标题（scope 含当前节点） */
  title: { node: TreeNode };
};

/** Tree 状态快照（由逻辑层暴露） */
export type TreeState = {
  /** 当前展开的 key 列表 */
  expandedKeys: string[];
  /** 当前勾选的 key 列表（仅 checkable 时维护） */
  checkedKeys: string[];
  /** 当前选中的 key（null 表示未选中） */
  selectedKey: string | null;
  /** 禁用状态 */
  disabled: boolean;
};

/** Tree 逻辑实例（通用接口 + 交互方法） */
export type TreeLogic = LogicInstance<TreeProps, TreeState> & {
  /** 展开 / 收起节点（disabled 节点忽略） */
  toggleExpand: (key: string) => void;
  /** 切换节点勾选状态（默认级联子节点，checkStrictly 时仅切换自身） */
  toggleCheck: (key: string) => void;
  /** 选中节点（disabled 节点忽略） */
  select: (key: string) => void;
  /** 展开全部非叶子节点 */
  expandAll: () => void;
  /** 收起全部节点 */
  collapseAll: () => void;
  /** 勾选全部非禁用节点 */
  checkAll: () => void;
  /** 清空全部勾选 */
  uncheckAll: () => void;
  /** 查询节点是否展开 */
  isExpanded: (key: string) => boolean;
  /** 查询节点勾选状态（父级由后代叶子勾选情况推导） */
  getCheckState: (key: string) => { checked: boolean; indeterminate: boolean };
};
