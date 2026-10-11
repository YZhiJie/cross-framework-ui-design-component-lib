/** Table 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 */

import type { LogicInstance } from '../../types';

/** 表格行（键值对，取值经 record[key]） */
export type TableRow = Record<string, unknown>;

/** 单元格对齐方式 */
export type TableAlign = 'left' | 'center' | 'right';

/** 排序方向（null 表示未排序） */
export type TableSortOrder = 'asc' | 'desc' | null;

/** 排序变更事件载荷 */
export type TableSort = {
  /** 触发排序的列 key */
  key: string;
  /** 新的排序方向（null 表示已取消排序） */
  order: TableSortOrder;
};

/** 列定义 */
export type TableColumn = {
  /** 列标识（对应行数据的字段名，组内唯一） */
  key: string;
  /** 表头文案 */
  title: string;
  /** 列宽（数字按 px，字符串原样） */
  width?: number | string;
  /** 单元格对齐方式 */
  align?: TableAlign;
  /** 是否可排序（点击表头循环 升序 → 降序 → 取消） */
  sortable?: boolean;
  /** 自定义单元格渲染（返回字符串覆盖默认取值） */
  render?: (record: TableRow, index: number) => string;
};

/** Table Props（Vue 与 React 共用） */
export type TableProps = {
  /** 列定义数组 */
  columns: TableColumn[];
  /** 行数据数组 */
  dataSource: TableRow[];
  /** 行唯一键字段名（缺省时以行下标作为 key） */
  rowKey?: string;
  /** 斑马纹 */
  stripe?: boolean;
  /** 边框 */
  border?: boolean;
  /** 排序变更回调（契约事件，非受控内部排序） */
  onSortChange?: (sort: TableSort) => void;
};

/** Table 事件契约 */
export type TableEvents = {
  sortChange: (sort: TableSort) => void;
};

/** Table 插槽契约 */
export type TableSlots = {
  /** 空数据内容（Vue #empty ↔ React renderEmpty 回调） */
  empty: Record<string, never>;
};

/** Table 状态快照（由逻辑层暴露） */
export type TableState = {
  /** 当前排序列 key（null 表示未排序） */
  sortKey: string | null;
  /** 当前排序方向 */
  sortOrder: TableSortOrder;
  /** 排序后的行数据快照（未排序时保持原序） */
  sortedData: TableRow[];
};

/** Table 逻辑实例（通用接口 + 交互方法） */
export type TableLogic = LogicInstance<TableProps, TableState> & {
  /** 切换指定列排序：新列升序起步，循环 升序 → 降序 → 取消 */
  toggleSort: (key: string) => void;
};
