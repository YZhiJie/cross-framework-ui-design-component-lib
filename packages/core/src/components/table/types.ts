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

/** 行唯一键类型（rowKey 字段取值或回退的行下标） */
export type TableRowKey = string | number;

/** 行选择配置 */
export type TableRowSelection = {
  /** 受控选中行键集合（提供时进入受控模式，选中状态由外部驱动） */
  selectedRowKeys?: TableRowKey[];
  /** 选中行变化回调（全量键集合 + 当前行数据快照） */
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  /** 指定行的选择框禁用（不可勾选，也不参与全选计数） */
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
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
  /** 行唯一键字段名（缺省时以行下标作为 key；行选择模式下必填以保证选择键稳定） */
  rowKey?: string;
  /** 斑马纹 */
  stripe?: boolean;
  /** 边框 */
  border?: boolean;
  /** 启用虚拟滚动（固定行高渲染可视窗口；需提供 height，rowHeight 缺省 40px） */
  virtual?: boolean;
  /** 滚动容器高度（数字按 px，字符串原样；虚拟滚动必填） */
  height?: number | string;
  /** 行高 px（虚拟滚动必需；非虚拟模式下作为行高样式生效） */
  rowHeight?: number;
  /** 行选择配置（提供后自动追加选择列） */
  rowSelection?: TableRowSelection;
  /** 根节点自定义类名（叠加在 xui-table 之后） */
  className?: string;
  /** 根节点内联样式（可覆盖组件级 CSS 变量，如 --xui-table-row-height） */
  style?: Record<string, string>;
  /** 排序变更回调（契约事件，非受控内部排序） */
  onSortChange?: (sort: TableSort) => void;
  /** 行点击回调（选择列单元格不触发） */
  onRowClick?: (record: TableRow, index: number) => void;
};

/** Table 事件契约 */
export type TableEvents = {
  sortChange: (sort: TableSort) => void;
  rowClick: (record: TableRow, index: number) => void;
};

/** Table 插槽契约 */
export type TableSlots = {
  /** 空数据内容（Vue #empty ↔ React renderEmpty 回调） */
  empty: Record<string, never>;
  /** 自定义排序图标（作用域参数 order 为 'asc' | 'desc'，替换内置 arrow-up/arrow-down） */
  sortIcon: { order: 'asc' | 'desc' };
};

/** Table 状态快照（由逻辑层暴露） */
export type TableState = {
  /** 当前排序列 key（null 表示未排序） */
  sortKey: string | null;
  /** 当前排序方向 */
  sortOrder: TableSortOrder;
  /** 排序后的行数据快照（未排序时保持原序） */
  sortedData: TableRow[];
  /** 当前选中行键集合（行选择模式；受控模式优先呈现外部值） */
  selectedRowKeys: TableRowKey[];
  /** 全选状态：可选行全部选中 */
  allSelected: boolean;
  /** 半选状态：部分可选行被选中 */
  indeterminate: boolean;
};

/** Table 逻辑实例（通用接口 + 交互方法） */
export type TableLogic = LogicInstance<TableProps, TableState> & {
  /** 切换指定列排序：新列升序起步，循环 升序 → 降序 → 取消 */
  toggleSort: (key: string) => void;
  /** 切换指定行的选中状态（禁用行忽略；非受控更新内部集合，受控仅回调） */
  toggleRow: (key: TableRowKey) => void;
  /** 切换全选（未全选含半选时选中全部可选行，已全选时清除全部） */
  toggleAll: () => void;
};
