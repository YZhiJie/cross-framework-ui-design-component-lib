// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import {
  createTimeSlotPickerLogic,
  getTimeSlotGrid,
  getTimeSlotGridKeys,
} from '../create-time-slot-picker-logic';

describe('getTimeSlotGrid', () => {
  it('day：24 小时单行网格', () => {
    const grid = getTimeSlotGrid('day', '2026-10-20');
    expect(grid.total).toBe(24);
    expect(grid.columns).toHaveLength(24);
    expect(grid.rows).toHaveLength(1);
    expect(grid.rows[0].cells).toHaveLength(24);
    expect(grid.rows[0].cells[0]).toMatchObject({ key: 'h:00', hour: 0 });
    expect(grid.rows[0].cells[23]).toMatchObject({ key: 'h:23', hour: 23 });
  });

  it('week：周一至周日 × 24 小时', () => {
    const grid = getTimeSlotGrid('week', '2026-10-20');
    expect(grid.total).toBe(168);
    expect(grid.rows).toHaveLength(7);
    expect(grid.rows[0]).toMatchObject({ weekday: 1 });
    expect(grid.rows[0].cells[8]).toMatchObject({ key: 'w:1:08', weekday: 1, hour: 8 });
    expect(grid.rows[6].cells[23]).toMatchObject({ key: 'w:7:23', weekday: 7, hour: 23 });
  });

  it('month：周一开始的日历，按真实星期插入占位', () => {
    const grid = getTimeSlotGrid('month', '2026-10-20');
    expect(grid.total).toBe(31);
    expect(grid.year).toBe(2026);
    expect(grid.month).toBe(10);
    expect(grid.columns.map((column) => column.index)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    // 2026-10-01 为周四，周一开头需前置 3 个空格
    expect(grid.rows[0].cells.slice(0, 3)).toEqual([null, null, null]);
    expect(grid.rows[0].cells[3]).toMatchObject({
      key: '2026-10-01',
      day: 1,
      weekday: 4,
    });
    expect(grid.rows[4].cells[5]).toMatchObject({ key: '2026-10-31', day: 31 });
  });

  it('year：整年日期热力图，列头标注每月 1 日所在周', () => {
    const grid = getTimeSlotGrid('year', '2026-10-20');
    expect(grid.total).toBe(365);
    expect(grid.rows).toHaveLength(7);
    // 2026-01-01 为周四，前置 3 天 + 365 天 = 53 周
    expect(grid.columns).toHaveLength(53);
    expect(getTimeSlotGridKeys(grid)).toContain('2026-01-01');
    expect(getTimeSlotGridKeys(grid)).toContain('2026-12-31');
    const monthHeaders = grid.columns.filter((column) => column.kind === 'month');
    expect(monthHeaders.map((column) => column.index)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  it('year：闰年 366 天', () => {
    expect(getTimeSlotGrid('year', '2024-06-01').total).toBe(366);
  });

  it('非法参考日期回退到当天', () => {
    const grid = getTimeSlotGrid('year', '2026-02-31');
    const now = new Date();
    expect(grid.year).toBe(now.getFullYear());
  });
});

describe('createTimeSlotPickerLogic', () => {
  it('非受控：toggle 切换、去重并按 key 升序输出', () => {
    const onChange = vi.fn();
    const logic = createTimeSlotPickerLogic({ granularity: 'day', onChange });
    logic.toggle('h:09');
    logic.toggle('h:08');
    expect(logic.getState().value).toEqual(['h:08', 'h:09']);
    expect(logic.getState().selectedCount).toBe(2);
    expect(onChange).toHaveBeenLastCalledWith(['h:08', 'h:09']);
    logic.toggle('h:08');
    expect(logic.getState().value).toEqual(['h:09']);
  });

  it('受控：内部值不变，仅回调新值', () => {
    const onChange = vi.fn();
    const logic = createTimeSlotPickerLogic({
      granularity: 'day',
      value: ['h:01'],
      onChange,
    });
    logic.toggle('h:02');
    expect(logic.getState().value).toEqual(['h:01']);
    expect(onChange).toHaveBeenCalledWith(['h:01', 'h:02']);
  });

  it('updateOptions：同步受控值与粒度，selectedCount 只统计当前网格', () => {
    const logic = createTimeSlotPickerLogic({
      granularity: 'day',
      value: ['h:01', '2026-10-20'],
    });
    expect(logic.getState()).toMatchObject({ total: 24, selectedCount: 1 });

    logic.updateOptions({ granularity: 'month', referenceDate: '2026-10-20' });
    expect(logic.getState()).toMatchObject({ total: 31, selectedCount: 1 });
    expect(logic.getState().value).toEqual(['2026-10-20', 'h:01']);

    logic.updateOptions({ value: ['2026-10-21', '2026-10-22'] });
    expect(logic.getState()).toMatchObject({ selectedCount: 2 });
    expect(logic.getState().value).toEqual(['2026-10-21', '2026-10-22']);
  });

  it('矩形框选：拖拽期间只预览，mouseup 时一次性提交', () => {
    const logic = createTimeSlotPickerLogic({ granularity: 'week' });
    expect(logic.beginPaint('w:1:00')).toBe(true);
    expect(logic.getState().paint).toEqual({ keys: ['w:1:00'], selected: true });

    // 拖到第 2 行第 3 列：形成 2 行 × 3 列矩形
    logic.paintTo('w:2:02');
    expect(logic.getState().value).toEqual([]);
    expect(logic.getState().paint?.keys).toEqual([
      'w:1:00',
      'w:1:01',
      'w:1:02',
      'w:2:00',
      'w:2:01',
      'w:2:02',
    ]);

    // 缩小矩形时预览同步收缩，不会残留此前经过的格子
    logic.paintTo('w:2:01');
    expect(logic.getState().paint?.keys).toEqual(['w:1:00', 'w:1:01', 'w:2:00', 'w:2:01']);

    logic.endPaint();
    expect(logic.getState().value).toEqual(['w:1:00', 'w:1:01', 'w:2:00', 'w:2:01']);
    expect(logic.getState().paint).toBeNull();

    // 结束后 paintTo 失效
    logic.paintTo('w:1:05');
    expect(logic.getState().value).toHaveLength(4);
  });

  it('矩形框选取消：从已选格子开始拖拽时统一取消矩形内选中', () => {
    const onChange = vi.fn();
    const logic = createTimeSlotPickerLogic({
      granularity: 'week',
      defaultValue: ['w:1:00', 'w:1:01', 'w:2:00', 'w:2:01', 'w:3:05'],
      onChange,
    });

    expect(logic.beginPaint('w:1:00')).toBe(false);
    logic.paintTo('w:2:01');
    expect(logic.getState().value).toHaveLength(5);
    logic.endPaint();

    expect(logic.getState().value).toEqual(['w:3:05']);
    expect(onChange).toHaveBeenLastCalledWith(['w:3:05']);
  });

  it('矩形框选跳过日历占位（月视图）', () => {
    const logic = createTimeSlotPickerLogic({
      granularity: 'month',
      referenceDate: '2026-10-20',
    });
    // 2026-10-01 位于周四（第 1 行第 4 列），拖到 10-04（周日）
    logic.beginPaint('2026-10-01');
    logic.paintTo('2026-10-04');
    logic.endPaint();
    expect(logic.getState().value).toEqual([
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ]);
  });

  it('selectAll / clear 覆盖当前粒度全部格子', () => {
    const onChange = vi.fn();
    const logic = createTimeSlotPickerLogic({ granularity: 'day', onChange });
    logic.selectAll();
    expect(logic.getState().value).toHaveLength(24);
    expect(logic.getState().selectedCount).toBe(24);
    logic.clear();
    expect(logic.getState().value).toEqual([]);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('subscribe：状态变化时收到不可变快照', () => {
    const listener = vi.fn();
    const logic = createTimeSlotPickerLogic({ granularity: 'day' });
    const unsubscribe = logic.subscribe(listener);
    logic.toggle('h:00');
    expect(listener).toHaveBeenCalledWith({
      value: ['h:00'],
      total: 24,
      selectedCount: 1,
      paint: null,
    });
    unsubscribe();
    logic.toggle('h:01');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('非法 key 静默忽略', () => {
    const logic = createTimeSlotPickerLogic({ granularity: 'day' });
    logic.toggle('');
    logic.setSelected('h:00', true);
    expect(logic.getState().value).toEqual(['h:00']);
  });
});
