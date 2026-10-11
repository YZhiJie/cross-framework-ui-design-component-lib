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
    expect(logic.getState()).toEqual({ sortKey: null, sortOrder: null, sortedData: rows });
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
