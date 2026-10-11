/**
 * Table 纯逻辑工厂
 *
 * 状态：sortKey / sortOrder / sortedData
 * 交互：toggleSort（新列升序起步，循环 升序 → 降序 → 取消）
 * 排序为非受控内部排序（客户端比较）：数值列按数值比较，
 * 其余按字符串比较；取消排序后恢复原序（稳定排序）。
 * dataSource 变更时保持当前排序重新应用。
 * 通过 subscribe 通知状态变更，getState 返回不可变快照。
 */

import type { LogicInstance, StateListener } from '../../types';

/** 表格行（与 @xui/core 的 TableRow 结构一致；shared 不依赖 core，本地定义） */
export type TableRow = Record<string, unknown>;

/** 排序方向（与 @xui/core 的 TableSortOrder 对齐） */
export type TableSortOrder = 'asc' | 'desc' | null;

/** 排序变更事件载荷（与 @xui/core 的 TableSort 对齐） */
export type TableSort = {
  key: string;
  order: TableSortOrder;
};

/** Table 逻辑配置（由适配层从 Props 中提取注入） */
export type TableLogicOptions = {
  /** 行数据数组 */
  dataSource?: TableRow[];
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
};

/** Table 逻辑实例 */
export interface TableLogicInstance extends LogicInstance<TableLogicOptions, TableState> {
  /** 切换指定列排序：新列升序起步，循环 升序 → 降序 → 取消 */
  toggleSort: (key: string) => void;
}

/** 单元格取值展示格式化（双端适配层共用）：null/undefined 显示为空串 */
export function formatTableCellValue(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
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

  const state: TableState = {
    sortKey: null,
    sortOrder: null,
    sortedData: dataSource,
  };

  let onSortChange = options.onSortChange;
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

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      if (next.dataSource !== undefined && next.dataSource !== dataSource) {
        dataSource = next.dataSource;
        changed = true;
      }
      if (next.onSortChange !== undefined) {
        onSortChange = next.onSortChange;
      }

      if (changed) {
        applySort();
        notify();
      }
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
  };
}
