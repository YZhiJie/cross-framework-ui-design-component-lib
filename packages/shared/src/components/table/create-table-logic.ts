/**
 * Table 纯逻辑工厂
 *
 * 状态：sortKey / sortOrder / sortedData / selectedRowKeys / allSelected / indeterminate
 * 交互：toggleSort（新列升序起步，循环 升序 → 降序 → 取消）
 *      toggleRow / toggleAll（行选择；禁用行忽略，不参与全选计数）
 * 排序为非受控内部排序（客户端比较）：数值列按数值比较，
 * 其余按字符串比较；取消排序后恢复原序（稳定排序）。
 * 行选择非受控内部维护 Set；提供 rowSelection.selectedRowKeys 进入受控模式。
 * dataSource 变更时保持当前排序重新应用；无 rowKey 时以行下标作为选择键。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 表格行（与 @xui-design/core 的 TableRow 结构一致；shared 不依赖 core，本地定义） */
export type TableRow = Record<string, unknown>;

/** 行唯一键类型（与 @xui-design/core 的 TableRowKey 对齐） */
export type TableRowKey = string | number;

/** 排序方向（与 @xui-design/core 的 TableSortOrder 对齐） */
export type TableSortOrder = 'asc' | 'desc' | null;

/** 排序变更事件载荷（与 @xui-design/core 的 TableSort 对齐） */
export type TableSort = {
  key: string;
  order: TableSortOrder;
};

/** 行选择配置（与 @xui-design/core 的 TableRowSelection 对齐） */
export type TableRowSelection = {
  /** 受控选中行键集合（提供时进入受控模式） */
  selectedRowKeys?: TableRowKey[];
  /** 选中行变化回调 */
  onChange?: (selectedRowKeys: TableRowKey[], selectedRows: TableRow[]) => void;
  /** 指定行的选择框禁用（不参与全选计数） */
  getCheckboxDisabled?: (record: TableRow, index: number) => boolean;
};

/** Table 逻辑配置（由适配层从 Props 中提取注入） */
export type TableLogicOptions = {
  /** 行数据数组 */
  dataSource?: TableRow[];
  /** 行唯一键字段名（缺省时以行下标作为 key） */
  rowKey?: string;
  /** 行选择配置（提供后启用选择列） */
  rowSelection?: TableRowSelection;
  onSortChange?: (sort: TableSort) => void;
};

/** Table 状态快照 */
export type TableState = {
  /** 当前排序列 key（null 表示未排序） */
  sortKey: string | null;
  /** 当前排序方向 */
  sortOrder: TableSortOrder;
  /** 排序后的行数据快照（未排序时保持原序） */
  sortedData: TableRow[];
  /** 当前选中行键集合（受控模式优先呈现外部值） */
  selectedRowKeys: TableRowKey[];
  /** 全选状态：可选行全部选中（无可选行时为 false） */
  allSelected: boolean;
  /** 半选状态：部分可选行被选中 */
  indeterminate: boolean;
};

/** Table 逻辑实例 */
export interface TableLogicInstance extends LogicInstance<TableLogicOptions, TableState> {
  /** 切换指定列排序：新列升序起步，循环 升序 → 降序 → 取消 */
  toggleSort: (key: string) => void;
  /** 切换指定行选中状态（禁用行忽略；非受控更新内部集合，受控仅回调） */
  toggleRow: (key: TableRowKey) => void;
  /** 切换全选（全选/半选时清除全部，否则选中全部可选行） */
  toggleAll: () => void;
}

/** 单元格取值展示格式化（双端适配层共用）：null/undefined 显示为空串 */
export function formatTableCellValue(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

/** 行键提取（双端适配层共用）：rowKey 字段值为 string/number 时返回，否则回退行下标 */
export function getRowKeyOf(record: TableRow, index: number, rowKey?: string): TableRowKey {
  if (rowKey === undefined) return index;
  const key = record[rowKey];
  return typeof key === 'string' || typeof key === 'number' ? key : index;
}

const compareValues = (a: unknown, b: unknown): number => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  const as = String(a ?? '');
  const bs = String(b ?? '');
  if (as < bs) return -1;
  if (as > bs) return 1;
  return 0;
};

export function createTableLogic(options: TableLogicOptions = {}): TableLogicInstance {
  let dataSource: TableRow[] = options.dataSource ?? [];
  let rowKey = options.rowKey;
  let rowSelection = options.rowSelection;

  const state: TableState = {
    sortKey: null,
    sortOrder: null,
    sortedData: dataSource,
    selectedRowKeys: [],
    allSelected: false,
    indeterminate: false,
  };

  let onSortChange = options.onSortChange;
  // 非受控内部选中集合（受控模式不使用，呈现外部传入值）
  const selectedSet = new Set<TableRowKey>();
  const listeners = new Set<StateListener<TableState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  // 依据当前排序状态重排数据快照（未排序时保持原序）
  const applySort = () => {
    if (state.sortKey === null || state.sortOrder === null) {
      state.sortedData = dataSource;
      return;
    }
    const key = state.sortKey;
    const direction = state.sortOrder === 'asc' ? 1 : -1;
    state.sortedData = [...dataSource].sort((a, b) => compareValues(a[key], b[key]) * direction);
  };

  /** 可选行（未被 getCheckboxDisabled 禁用的行）键集合 */
  const selectableKeys = (): TableRowKey[] => {
    if (rowSelection?.getCheckboxDisabled === undefined) {
      return dataSource.map((record, index) => getRowKeyOf(record, index, rowKey));
    }
    const isDisabled = rowSelection.getCheckboxDisabled;
    const keys: TableRowKey[] = [];
    dataSource.forEach((record, index) => {
      if (!isDisabled(record, index)) keys.push(getRowKeyOf(record, index, rowKey));
    });
    return keys;
  };

  /** 按键集合重算全选 / 半选并写入 state */
  const syncSelectionFlags = (keys: TableRowKey[]): void => {
    const selectable = selectableKeys();
    const selectedCount = selectable.filter((key) => keys.includes(key)).length;
    state.allSelected = selectable.length > 0 && selectedCount === selectable.length;
    state.indeterminate = selectedCount > 0 && selectedCount < selectable.length;
  };

  /** 呈现选中键集合：受控优先外部值，否则取内部集合 */
  const presentSelection = (): void => {
    const controlledKeys = rowSelection?.selectedRowKeys;
    const keys = controlledKeys !== undefined ? controlledKeys : [...selectedSet];
    state.selectedRowKeys = keys;
    syncSelectionFlags(keys);
  };

  /** 触发 onChange（携带当前行数据快照） */
  const emitSelectionChange = (keys: TableRowKey[]): void => {
    if (rowSelection?.onChange === undefined) return;
    const keySet = new Set(keys);
    const selectedRows = dataSource.filter((record, index) =>
      keySet.has(getRowKeyOf(record, index, rowKey)),
    );
    rowSelection.onChange(keys, selectedRows);
  };

  // 初始化：受控值直接呈现
  if (rowSelection?.selectedRowKeys !== undefined) {
    state.selectedRowKeys = rowSelection.selectedRowKeys;
    syncSelectionFlags(rowSelection.selectedRowKeys);
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state, selectedRowKeys: [...state.selectedRowKeys] }),

    updateOptions(next) {
      let changed = false;

      if (next.dataSource !== undefined && next.dataSource !== dataSource) {
        dataSource = next.dataSource;
        // 数据源变化后按当前排序重排；行选择标志位同步重算
        applySort();
        if (rowSelection !== undefined) presentSelection();
        changed = true;
      }
      if (next.rowKey !== undefined && next.rowKey !== rowKey) {
        rowKey = next.rowKey;
        if (rowSelection !== undefined) presentSelection();
        changed = true;
      }
      if (next.rowSelection !== undefined && next.rowSelection !== rowSelection) {
        rowSelection = next.rowSelection;
        presentSelection();
        changed = true;
      }
      if (next.onSortChange !== undefined) {
        onSortChange = next.onSortChange;
      }

      if (changed) notify();
    },

    toggleSort(key) {
      let order: TableSortOrder;
      if (state.sortKey !== key) {
        state.sortKey = key;
        order = 'asc';
      } else if (state.sortOrder === 'asc') {
        order = 'desc';
      } else if (state.sortOrder === 'desc') {
        state.sortKey = null;
        order = null;
      } else {
        // 已是取消态的重复点击：维持取消
        order = null;
      }
      state.sortOrder = order;
      applySort();
      notify();
      onSortChange?.({ key, order });
    },

    toggleRow(key) {
      if (rowSelection === undefined) return;

      // 禁用行忽略：按 dataSource 里的位置校验
      const rowIndex = dataSource.findIndex((record, i) => getRowKeyOf(record, i, rowKey) === key);
      if (rowIndex !== -1) {
        const record = dataSource[rowIndex];
        if (rowSelection.getCheckboxDisabled?.(record, rowIndex) === true) return;
      }

      const controlledKeys = rowSelection.selectedRowKeys;
      const nextKeys = controlledKeys !== undefined ? [...controlledKeys] : [...selectedSet];
      const pos = nextKeys.indexOf(key);
      if (pos === -1) nextKeys.push(key);
      else nextKeys.splice(pos, 1);

      if (controlledKeys === undefined) {
        selectedSet.clear();
        nextKeys.forEach((k) => selectedSet.add(k));
        presentSelection();
        notify();
      }
      emitSelectionChange(nextKeys);
    },

    toggleAll() {
      if (rowSelection === undefined) return;
      const controlledKeys = rowSelection.selectedRowKeys;
      const currentKeys = controlledKeys !== undefined ? controlledKeys : [...selectedSet];
      const selectable = selectableKeys();

      // 全选或半选 → 清除全部；未全选 → 选中全部可选行
      const allOn = selectable.length > 0 && selectable.every((key) => currentKeys.includes(key));
      const nextKeys = allOn
        ? currentKeys.filter((key) => !selectable.includes(key))
        : [...new Set([...currentKeys, ...selectable])];

      if (controlledKeys === undefined) {
        selectedSet.clear();
        nextKeys.forEach((k) => selectedSet.add(k));
        presentSelection();
        notify();
      }
      emitSelectionChange(nextKeys);
    },
  };
}
