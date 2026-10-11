import { describe, expect, it, vi } from 'vitest';
import {
  createDatePickerLogic,
  formatDateParts,
  getMonthMatrix,
  isValidDateString,
  parseDateString,
  todayString,
} from '../create-date-picker-logic';

describe('日期工具函数', () => {
  it('formatDateParts 补零输出', () => {
    expect(formatDateParts(2026, 1, 5)).toBe('2026-01-05');
    expect(formatDateParts(2026, 12, 31)).toBe('2026-12-31');
  });

  it('isValidDateString 校验格式与真实日期', () => {
    expect(isValidDateString('2026-02-28')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true); // 闰年
    expect(isValidDateString('2026-02-29')).toBe(false); // 平年无 29 日
    expect(isValidDateString('2026-2-3')).toBe(false); // 未补零
    expect(isValidDateString('2026-13-01')).toBe(false);
    expect(isValidDateString('abc')).toBe(false);
    expect(isValidDateString(20260101)).toBe(false);
    expect(isValidDateString(undefined)).toBe(false);
  });

  it('parseDateString 解析合法值，非法返回 null', () => {
    expect(parseDateString('2026-10-11')).toEqual({ year: 2026, month: 10, day: 11 });
    expect(parseDateString('2026-02-30')).toBeNull();
  });

  it('todayString 返回本地今天', () => {
    expect(todayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('getMonthMatrix 生成 42 格且含首尾月', () => {
    const cells = getMonthMatrix(2026, 10);
    expect(cells).toHaveLength(42);
    // 2026-10-01 是周四：前 4 格为 9 月
    expect(cells[0]!.inMonth).toBe(false);
    expect(cells[3]!.date).toBe('2026-09-30');
    expect(cells[4]).toMatchObject({ date: '2026-10-01', day: 1, inMonth: true });
    expect(cells[34]).toMatchObject({ date: '2026-10-31', inMonth: true });
    expect(cells[35]!.inMonth).toBe(false);
    expect(cells[35]!.date).toBe('2026-11-01');
    // 每格日期连续
    for (let i = 1; i < cells.length; i += 1) {
      const prev = parseDateString(cells[i - 1]!.date)!;
      const curr = parseDateString(cells[i]!.date)!;
      const diff =
        (Date.UTC(curr.year, curr.month - 1, curr.day) -
          Date.UTC(prev.year, prev.month - 1, prev.day)) /
        86_400_000;
      expect(diff).toBe(1);
    }
  });
});

describe('createDatePickerLogic', () => {
  it('初始状态：未展开、视图定位到今天', () => {
    const logic = createDatePickerLogic();
    const state = logic.getState();
    expect(state.value).toBeNull();
    expect(state.open).toBe(false);
    const now = new Date();
    expect(state.viewYear).toBe(now.getFullYear());
    expect(state.viewMonth).toBe(now.getMonth() + 1);
  });

  it('defaultValue 非法回退 null，合法则定位视图', () => {
    expect(createDatePickerLogic({ defaultValue: 'not-a-date' }).getState().value).toBeNull();
    const logic = createDatePickerLogic({ defaultValue: '2024-02-29' });
    expect(logic.getState().value).toBe('2024-02-29');
    expect(logic.getState().viewYear).toBe(2024);
    expect(logic.getState().viewMonth).toBe(2);
  });

  it('toggleOpen 展开并定位视图到选中值，再收起', () => {
    const logic = createDatePickerLogic({ defaultValue: '2026-03-15' });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(true);
    expect(logic.getState().viewYear).toBe(2026);
    expect(logic.getState().viewMonth).toBe(3);
    logic.toggleOpen();
    expect(logic.getState().open).toBe(false);
  });

  it('未选中时展开视图定位到今天', () => {
    const logic = createDatePickerLogic();
    logic.toggleOpen();
    const now = new Date();
    expect(logic.getState().viewYear).toBe(now.getFullYear());
    expect(logic.getState().viewMonth).toBe(now.getMonth() + 1);
  });

  it('prevMonth / nextMonth 跨年滚动', () => {
    const logic = createDatePickerLogic({ defaultValue: '2026-01-15' });
    logic.prevMonth();
    expect(logic.getState().viewYear).toBe(2025);
    expect(logic.getState().viewMonth).toBe(12);
    logic.nextMonth();
    expect(logic.getState().viewYear).toBe(2026);
    expect(logic.getState().viewMonth).toBe(1);
    logic.nextMonth();
    expect(logic.getState().viewMonth).toBe(2);
  });

  it('select 更新 value、收起面板并触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.toggleOpen();
    logic.select('2026-10-11');
    expect(logic.getState().value).toBe('2026-10-11');
    expect(logic.getState().open).toBe(false);
    expect(onChange).toHaveBeenCalledWith('2026-10-11');
  });

  it('select 非法日期忽略', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.select('2026-02-30');
    expect(logic.getState().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控模式：select 仅回调不内部更新', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ value: '2026-01-01', onChange });
    logic.toggleOpen();
    logic.select('2026-10-11');
    expect(logic.getState().value).toBe('2026-01-01');
    expect(onChange).toHaveBeenCalledWith('2026-10-11');
    logic.updateOptions({ value: '2026-10-11' });
    expect(logic.getState().value).toBe('2026-10-11');
  });

  it('clear 非受控置 null 并触发 onClear，受控仅回调', () => {
    const onClear = vi.fn();
    const logic = createDatePickerLogic({ defaultValue: '2026-10-11', onClear });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);

    const controlled = createDatePickerLogic({ value: '2026-10-11', onClear });
    controlled.clear();
    expect(controlled.getState().value).toBe('2026-10-11');
    expect(onClear).toHaveBeenCalledTimes(2);
  });

  it('disabled 时无法展开、无法选中，运行时禁用收起面板', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ disabled: true, onChange });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(false);
    logic.select('2026-10-11');
    expect(onChange).not.toHaveBeenCalled();

    const listener = vi.fn();
    const runtime = createDatePickerLogic();
    runtime.subscribe(listener);
    runtime.toggleOpen();
    runtime.updateOptions({ disabled: true });
    expect(runtime.getState().open).toBe(false);
    expect(listener).toHaveBeenCalled();
  });

  it('受控 value 更新为非法值回退 null', () => {
    const logic = createDatePickerLogic({ value: '2026-10-11' });
    logic.updateOptions({ value: 'oops' });
    expect(logic.getState().value).toBeNull();
  });
});
