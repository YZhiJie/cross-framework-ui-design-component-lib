import { describe, expect, it, vi } from 'vitest';
import { createTableLogic, formatTableCellValue } from '../create-table-logic';

const rows = [
  { id: 1, name: '张三', age: 30 },
  { id: 2, name: '李四', age: 25 },
  { id: 3, name: '王五', age: 28 },
];

describe('formatTableCellValue', () => {
  it('null/undefined 显示为空串，其余转字符串', () => {
    expect(formatTableCellValue(null)).toBe('');
    expect(formatTableCellValue(undefined)).toBe('');
    expect(formatTableCellValue(0)).toBe('0');
    expect(formatTableCellValue(false)).toBe('false');
    expect(formatTableCellValue('x')).toBe('x');
  });
});

describe('createTableLogic', () => {
  it('初始状态：未排序，数据保持原序', () => {
    const logic = createTableLogic({ dataSource: rows });
    expect(logic.getState()).toEqual({
      sortKey: null,
      sortOrder: null,
      sortedData: rows,
      selectedRowKeys: [],
      allSelected: false,
      indeterminate: false,
    });
  });

  it('toggleSort 新列升序起步并重排数据', () => {
    const logic = createTableLogic({ dataSource: rows });
    logic.toggleSort('age');
    expect(logic.getState().sortOrder).toBe('asc');
    expect(logic.getState().sortedData.map((row) => row.id)).toEqual([2, 3, 1]);
  });

  it('同列再点降序', () => {
    const logic = createTableLogic({ dataSource: rows });
    logic.toggleSort('age');
    logic.toggleSort('age');
    expect(logic.getState().sortOrder).toBe('desc');
    expect(logic.getState().sortedData.map((row) => row.id)).toEqual([1, 3, 2]);
  });

  it('同列第三次点击取消排序并恢复原序', () => {
    const logic = createTableLogic({ dataSource: rows });
    logic.toggleSort('age');
    logic.toggleSort('age');
    logic.toggleSort('age');
    expect(logic.getState().sortKey).toBeNull();
    expect(logic.getState().sortOrder).toBeNull();
    expect(logic.getState().sortedData.map((row) => row.id)).toEqual([1, 2, 3]);
  });

  it('切换到另一列直接升序', () => {
    const logic = createTableLogic({ dataSource: rows });
    logic.toggleSort('age');
    logic.toggleSort('name');
    expect(logic.getState().sortKey).toBe('name');
    expect(logic.getState().sortOrder).toBe('asc');
    // 字符串按码点比较：张三(U+5F20) < 李四(U+674E) < 王五(U+738B)
    expect(logic.getState().sortedData.map((row) => row.id)).toEqual([1, 2, 3]);
  });

  it('每次切换触发 onSortChange 载荷', () => {
    const onSortChange = vi.fn();
    const logic = createTableLogic({ dataSource: rows, onSortChange });
    logic.toggleSort('age');
    logic.toggleSort('age');
    logic.toggleSort('age');
    expect(onSortChange).toHaveBeenNthCalledWith(1, { key: 'age', order: 'asc' });
    expect(onSortChange).toHaveBeenNthCalledWith(2, { key: 'age', order: 'desc' });
    expect(onSortChange).toHaveBeenNthCalledWith(3, { key: 'age', order: null });
  });

  it('updateOptions 更新 dataSource 时保持当前排序', () => {
    const logic = createTableLogic({ dataSource: rows });
    logic.toggleSort('age');
    logic.updateOptions({ dataSource: [{ id: 4, name: '赵六', age: 26 }, ...rows] });
    expect(logic.getState().sortKey).toBe('age');
    expect(logic.getState().sortedData.map((row) => row.id)).toEqual([2, 4, 3, 1]);
  });

  it('排序不修改原数组', () => {
    const source = [...rows];
    const logic = createTableLogic({ dataSource: source });
    logic.toggleSort('age');
    expect(source.map((row) => row.id)).toEqual([1, 2, 3]);
  });
});

describe('createTableLogic 行选择', () => {
  const keyedRows = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
  ];

  it('未提供 rowSelection 时行为与旧版一致（selectedRowKeys 恒空）', () => {
    const logic = createTableLogic({ dataSource: rows });
    const state = logic.getState();
    expect(state.selectedRowKeys).toEqual([]);
    expect(state.allSelected).toBe(false);
    expect(state.indeterminate).toBe(false);
    // toggleRow / toggleAll 静默忽略
    expect(() => logic.toggleRow(1)).not.toThrow();
    expect(() => logic.toggleAll()).not.toThrow();
    expect(logic.getState().selectedRowKeys).toEqual([]);
  });

  it('toggleRow 非受控切换并同步全选/半选标志', () => {
    const logic = createTableLogic({ dataSource: keyedRows, rowKey: 'id', rowSelection: {} });

    logic.toggleRow(1);
    let state = logic.getState();
    expect(state.selectedRowKeys).toEqual([1]);
    expect(state.indeterminate).toBe(true);
    expect(state.allSelected).toBe(false);

    logic.toggleRow(2);
    logic.toggleRow(3);
    state = logic.getState();
    expect(state.allSelected).toBe(true);
    expect(state.indeterminate).toBe(false);

    logic.toggleRow(2);
    state = logic.getState();
    expect(state.selectedRowKeys).toEqual([1, 3]);
    expect(state.indeterminate).toBe(true);
  });

  it('无 rowKey 时以行下标作为选择键', () => {
    const logic = createTableLogic({ dataSource: keyedRows, rowSelection: {} });
    logic.toggleRow(0);
    expect(logic.getState().selectedRowKeys).toEqual([0]);
  });

  it('toggleAll 未全选（含半选）时选中全部可选行，已全选时清除全部', () => {
    const logic = createTableLogic({ dataSource: keyedRows, rowKey: 'id', rowSelection: {} });

    logic.toggleAll();
    expect(logic.getState().allSelected).toBe(true);

    logic.toggleRow(1);
    expect(logic.getState().indeterminate).toBe(true);
    // 半选状态点击 → 补全为全选（对齐 antd / Element Plus 语义）
    logic.toggleAll();
    expect(logic.getState().allSelected).toBe(true);

    logic.toggleAll();
    expect(logic.getState().selectedRowKeys).toEqual([]);
  });

  it('onChange 携带键集合与行数据快照', () => {
    const onChange = vi.fn();
    const logic = createTableLogic({
      dataSource: keyedRows,
      rowKey: 'id',
      rowSelection: { onChange },
    });

    logic.toggleRow(2);
    expect(onChange).toHaveBeenCalledWith([2], [{ id: 2, name: '李四' }]);

    logic.toggleAll();
    expect(onChange).toHaveBeenLastCalledWith([2, 1, 3], keyedRows);
  });

  it('受控模式：selectedRowKeys 外部驱动，toggleRow 仅回调不内部变更', () => {
    const onChange = vi.fn();
    let controlled = [1];
    const logic = createTableLogic({
      dataSource: keyedRows,
      rowKey: 'id',
      rowSelection: { selectedRowKeys: controlled, onChange },
    });

    expect(logic.getState().selectedRowKeys).toEqual([1]);

    logic.toggleRow(2);
    expect(onChange).toHaveBeenCalledWith(
      [1, 2],
      [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ],
    );
    // 内部未变更
    expect(logic.getState().selectedRowKeys).toEqual([1]);

    // 外部同步新值后呈现
    controlled = [1, 2];
    logic.updateOptions({ rowSelection: { selectedRowKeys: controlled, onChange } });
    expect(logic.getState().selectedRowKeys).toEqual([1, 2]);
    expect(logic.getState().indeterminate).toBe(true);
  });

  it('getCheckboxDisabled 的行不可勾选且不参与全选计数', () => {
    const logic = createTableLogic({
      dataSource: keyedRows,
      rowKey: 'id',
      rowSelection: { getCheckboxDisabled: (record) => record.id === 3 },
    });

    logic.toggleRow(3);
    expect(logic.getState().selectedRowKeys).toEqual([]);

    logic.toggleAll();
    // 仅选中可选行 1、2
    expect(logic.getState().allSelected).toBe(true);
    expect(logic.getState().selectedRowKeys).toEqual([1, 2]);

    // 已全选（可选行）时 toggleAll → 清除全部
    logic.toggleAll();
    expect(logic.getState().selectedRowKeys).toEqual([]);
  });

  it('dataSource 更新后选择标志位重算（保留仍存在的键）', () => {
    const logic = createTableLogic({ dataSource: keyedRows, rowKey: 'id', rowSelection: {} });
    logic.toggleRow(1);
    logic.toggleRow(2);

    logic.updateOptions({ dataSource: [keyedRows[0]] });
    const state = logic.getState();
    expect(state.selectedRowKeys).toEqual([1, 2]);
    // 数据里只有 1 可选 → 全选
    expect(state.allSelected).toBe(true);
  });
});
