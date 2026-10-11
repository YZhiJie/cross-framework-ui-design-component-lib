/** Pagination 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** Pagination Props（Vue 与 React 共用） */
export type PaginationProps = {
  /** 受控当前页（提供即受控，从 1 开始） */
  value?: number;
  /** 非受控初始页码 */
  defaultValue?: number;
  /** 数据总条数 */
  total: number;
  /** 每页条数 */
  pageSize?: number;
  /** 禁用状态 */
  disabled?: boolean;
  /** 页码变更回调（契约事件） */
  onChange?: (page: number) => void;
};

/** Pagination 事件契约 */
export type PaginationEvents = {
  change: (page: number) => void;
};

/** Pagination 插槽契约 */
export type PaginationSlots = Record<string, never>;

/** Pagination 状态快照（由逻辑层暴露） */
export type PaginationState = {
  /** 当前页（1 起始，越界自动 clamp） */
  page: number;
  /** 总页数（total/pageSize 变更时重算） */
  pageCount: number;
  disabled: boolean;
};

/** Pagination 逻辑实例（通用接口 + 交互方法） */
export type PaginationLogic = LogicInstance<PaginationProps, PaginationState> & {
  /** 跳转指定页：clamp 到有效范围，越界/重复跳转为 no-op（disabled 时忽略） */
  goTo: (page: number) => void;
  /** 上一页（第一页时为 no-op） */
  prev: () => void;
  /** 下一页（最后一页时为 no-op） */
  next: () => void;
};
