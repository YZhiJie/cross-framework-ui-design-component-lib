/** Breadcrumb 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 面包屑项 */
export type BreadcrumbItem = {
  /** 展示文本 */
  label: string;
  /** 链接地址（存在时渲染为 <a>，否则渲染为可点击 <span>） */
  href?: string;
  /** 禁用状态（不可点击） */
  disabled?: boolean;
};

/** Breadcrumb Props（Vue 与 React 共用） */
export type BreadcrumbProps = {
  /** 面包屑项列表（最后一项视为当前页，不可点击） */
  items?: BreadcrumbItem[];
  /** 分隔符（默认 '/'） */
  separator?: string;
  /** 自定义类名，追加到组件根元素 */
  className?: string;
  /** 自定义内联样式，合并到组件根元素 */
  style?: Record<string, string>;
  /** 点击可导航项回调（末项与 disabled 项不触发） */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
};

/** Breadcrumb 事件契约 */
export type BreadcrumbEvents = {
  itemClick: (item: BreadcrumbItem, index: number) => void;
};

/** Breadcrumb 插槽契约 */
export type BreadcrumbSlots = {
  /** 自定义内容区（覆盖 items 渲染） */
  default: Record<string, never>;
};

/** Breadcrumb 状态快照（由逻辑层暴露） */
export type BreadcrumbState = {
  items: BreadcrumbItem[];
  separator: string;
};

/** Breadcrumb 逻辑实例（通用接口 + 交互方法） */
export type BreadcrumbLogic = LogicInstance<BreadcrumbProps, BreadcrumbState> & {
  /** 点击某项：末项 / disabled 项静默忽略，其余触发回调 */
  selectItem: (index: number) => void;
};
