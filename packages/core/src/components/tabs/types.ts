/** Tabs 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 标签页项 */
export type TabItem = {
  /** 标签文案 */
  label: string;
  /** 标签值（唯一） */
  value: string;
  /** 禁用本项 */
  disabled?: boolean;
};

/** Tabs Props（Vue 与 React 共用） */
export type TabsProps = {
  /** 受控激活值（提供即受控） */
  value?: string;
  /** 非受控初始激活值 */
  defaultValue?: string;
  /** 标签页配置 */
  items: TabItem[];
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 激活项变更回调（契约事件） */
  onChange?: (value: string) => void;
};

/** Tabs 事件契约 */
export type TabsEvents = {
  change: (value: string) => void;
};

/** Tabs 插槽契约 */
export type TabsSlots = {
  /** 面板内容（作用域：当前激活项） */
  default: { item: TabItem };
};

/** Tabs 状态快照（由逻辑层暴露） */
export type TabsState = {
  /** 当前激活值（null 表示无激活项） */
  value: string | null;
};

/** Tabs 逻辑实例（通用接口 + 交互方法） */
export type TabsLogic = LogicInstance<TabsProps, TabsState> & {
  /** 激活指定标签：disabled 项忽略；非受控更新 value；受控仅回调 */
  activate: (value: string) => void;
  /** 键盘切换到下一个可用标签（跳过禁用项，循环） */
  moveActive: (delta: 1 | -1) => void;
};
