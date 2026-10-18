/** Cascader 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：value 为 string[]（从根到选中节点的值路径），
 * 空数组表示未选中；非叶子节点的 children 为空数组时视为叶子。
 */

import type { LogicInstance } from '../../types';

/** 级联选项（树形结构） */
export type CascaderOption = {
  /** 选项文案 */
  label: string;
  /** 选项值（同父级下唯一） */
  value: string;
  /** 子选项（存在且非空时表示非叶子节点） */
  children?: CascaderOption[];
  /** 禁用本项 */
  disabled?: boolean;
};

/** 单选模式的值类型：从根到选中节点的值路径 */
export type CascaderSingleValue = string[];
/** 多选模式的值类型：已选中的路径数组 */
export type CascaderMultiValue = string[][];
/** Cascader 值（单选 string[] / 多选 string[][]） */
export type CascaderValue = CascaderSingleValue | CascaderMultiValue;

/** Cascader Props（Vue 与 React 共用） */
export type CascaderProps = {
  /** 受控选中路径（单选 string[]，多选 string[][]；提供即受控） */
  value?: CascaderValue;
  /** 非受控初始选中路径 */
  defaultValue?: CascaderValue;
  /** 树形选项数据 */
  options: CascaderOption[];
  /** 占位文案 */
  placeholder?: string;
  /** 禁用状态 */
  disabled?: boolean;
  /** 是否显示清空按钮（仅已选中时） */
  clearable?: boolean;
  /** 选中路径展示分隔符（默认 ' / '） */
  separator?: string;
  /** 是否选中任意层级即触发 onChange（默认需选到叶子节点） */
  changeOnSelect?: boolean;
  /** 是否多选模式（开启后 value 为 string[][]，支持级联勾选与标签管理） */
  multiple?: boolean;
  /** 多选模式下是否允许选到任意层级（默认仅叶子节点可勾选） */
  checkStrictly?: boolean;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 选中值变更回调（值路径 + 文案路径；多选时均为数组） */
  onChange?: (value: CascaderValue, labels: string[] | string[][]) => void;
  /** 清空回调（契约事件） */
  onClear?: () => void;
};

/** Cascader 事件契约 */
export type CascaderEvents = {
  change: (value: CascaderValue, labels: string[] | string[][]) => void;
  clear: () => void;
};

/** Cascader 插槽契约 */
export type CascaderSlots = {
  /** 自定义清除图标（替换内置 clear，内容为任意节点） */
  clearIcon: Record<string, never>;
  /** 自定义后缀图标（替换内置 arrow-down，内容为任意节点） */
  suffixIcon: Record<string, never>;
};

/** Cascader 状态快照（由逻辑层暴露） */
export type CascaderState = {
  /** 当前选中路径（单选 string[] | null，多选 string[][]） */
  value: CascaderValue | null;
  /** 面板展开状态 */
  open: boolean;
  /** 当前展开的列路径值（决定渲染哪些列） */
  activePath: string[];
  disabled: boolean;
};

/** Cascader 逻辑实例（通用接口 + 交互方法） */
export type CascaderLogic = LogicInstance<CascaderProps, CascaderState> & {
  /** 展开 / 收起面板（disabled 时忽略；展开时 activePath 初始化为选中值） */
  toggleOpen: () => void;
  /** 收起面板 */
  close: () => void;
  /** 选中第 level 列的 value 选项；单选根据 changeOnSelect 决定是否立即回调，多选则切换勾选 */
  select: (level: number, value: string) => void;
  /** 清空选中值（非受控置 null，始终触发 onClear） */
  clear: () => void;
  /** 多选模式：切换某条路径的勾选状态 */
  toggleCheck?: (path: string[]) => void;
  /** 多选模式：全选当前所有叶子节点 */
  checkAll?: () => void;
  /** 多选模式：清空所有勾选 */
  uncheckAll?: () => void;
};
