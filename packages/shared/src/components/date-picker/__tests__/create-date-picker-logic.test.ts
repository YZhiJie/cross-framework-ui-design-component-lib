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
  it('初始状态：未展开、视图定位到今天、草稿跟随值', () => {
    const logic = createDatePickerLogic();
    const state = logic.getState();
    expect(state.value).toBeNull();
    expect(state.draft).toBeNull();
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

  it('select 仅更新草稿：不收起面板、不触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.toggleOpen();
    logic.select('2026-10-11');
    const state = logic.getState();
    expect(state.draft).toBe('2026-10-11');
    expect(state.value).toBeNull();
    expect(state.open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('confirm 非受控提交草稿并收起面板、触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.toggleOpen();
    logic.select('2026-10-11');
    logic.confirm();
    const state = logic.getState();
    expect(state.value).toBe('2026-10-11');
    expect(state.open).toBe(false);
    expect(onChange).toHaveBeenCalledWith('2026-10-11');
  });

  it('confirm 受控模式不更新内部 value，仅回调', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ value: '2026-01-01', onChange });
    logic.toggleOpen();
    logic.select('2026-10-11');
    logic.confirm();
    expect(logic.getState().value).toBe('2026-01-01');
    expect(onChange).toHaveBeenCalledWith('2026-10-11');
    logic.updateOptions({ value: '2026-10-11' });
    expect(logic.getState().value).toBe('2026-10-11');
    expect(logic.getState().draft).toBe('2026-10-11');
  });

  it('confirm 草稿与当前值相同时不触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ defaultValue: '2026-03-15', onChange });
    logic.toggleOpen();
    logic.confirm();
    expect(logic.getState().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('confirm 草稿为空时仅收起面板', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.toggleOpen();
    logic.confirm();
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('close 丢弃未确认的草稿', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ defaultValue: '2026-03-15', onChange });
    logic.toggleOpen();
    logic.select('2026-10-11');
    expect(logic.getState().draft).toBe('2026-10-11');
    logic.close();
    const state = logic.getState();
    expect(state.open).toBe(false);
    expect(state.draft).toBe('2026-03-15');
    expect(state.value).toBe('2026-03-15');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggleOpen 重新展开时草稿从 value 重新拷贝', () => {
    const logic = createDatePickerLogic({ defaultValue: '2026-03-15' });
    logic.toggleOpen();
    logic.select('2026-10-11');
    logic.close();
    logic.toggleOpen();
    expect(logic.getState().draft).toBe('2026-03-15');
  });

  it('selectShortcut 仅更新草稿，confirm 提交', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.toggleOpen();
    logic.selectShortcut('2026-12-24');
    expect(logic.getState().draft).toBe('2026-12-24');
    expect(logic.getState().open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    logic.confirm();
    expect(logic.getState().value).toBe('2026-12-24');
    expect(onChange).toHaveBeenCalledWith('2026-12-24');
  });

  it('select 非法日期忽略', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ onChange });
    logic.select('2026-02-30');
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().draft).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clear 非受控置 null 并触发 onClear，受控仅回调', () => {
    const onClear = vi.fn();
    const logic = createDatePickerLogic({ defaultValue: '2026-10-11', onClear });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().draft).toBeNull();
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
    expect(logic.getState().draft).toBeNull();
  });
});

describe('createDatePickerLogic range 模式', () => {
  it('初始值规整：乱序自动交换，非法回退 null', () => {
    const logic = createDatePickerLogic({
      type: 'range',
      defaultValue: ['2026-10-20', '2026-10-11'],
    });
    expect(logic.getState().value).toEqual(['2026-10-11', '2026-10-20']);
    expect(logic.getState().draft).toEqual(['2026-10-11', '2026-10-20']);

    const invalid = createDatePickerLogic({ type: 'range', defaultValue: ['2026-10-11', 'oops'] });
    expect(invalid.getState().value).toBeNull();
  });

  it('两次 select 写入草稿，confirm 提交并触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ type: 'range', onChange });
    logic.toggleOpen();
    expect(logic.getState().rangeStage).toBe('start');

    logic.select('2026-10-11');
    expect(logic.getState().rangeStart).toBe('2026-10-11');
    expect(logic.getState().rangeStage).toBe('end');
    expect(logic.getState().draft).toBeNull();
    expect(logic.getState().open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    logic.select('2026-10-20');
    expect(logic.getState().draft).toEqual(['2026-10-11', '2026-10-20']);
    expect(logic.getState().rangeStart).toBeNull();
    expect(logic.getState().open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    logic.confirm();
    expect(logic.getState().value).toEqual(['2026-10-11', '2026-10-20']);
    expect(logic.getState().open).toBe(false);
    expect(onChange).toHaveBeenCalledWith(['2026-10-11', '2026-10-20']);
  });

  it('end < start 自动交换后写入草稿', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ type: 'range', onChange });
    logic.toggleOpen();
    logic.select('2026-10-20');
    logic.select('2026-10-11');
    expect(logic.getState().draft).toEqual(['2026-10-11', '2026-10-20']);
    logic.confirm();
    expect(onChange).toHaveBeenCalledWith(['2026-10-11', '2026-10-20']);
  });

  it('close 丢弃 range 暂存与草稿', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({
      type: 'range',
      defaultValue: ['2026-01-01', '2026-01-31'],
      onChange,
    });
    logic.toggleOpen();
    logic.select('2026-10-11');
    logic.select('2026-10-20');
    expect(logic.getState().draft).toEqual(['2026-10-11', '2026-10-20']);
    logic.close();
    expect(logic.getState().draft).toEqual(['2026-01-01', '2026-01-31']);
    expect(logic.getState().rangeStart).toBeNull();
    expect(logic.getState().rangeStage).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('受控模式：confirm 仅回调不内部更新', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({
      type: 'range',
      value: ['2026-01-01', '2026-01-31'],
      onChange,
    });
    logic.toggleOpen();
    logic.select('2026-10-11');
    logic.select('2026-10-20');
    logic.confirm();
    expect(logic.getState().value).toEqual(['2026-01-01', '2026-01-31']);
    expect(onChange).toHaveBeenCalledWith(['2026-10-11', '2026-10-20']);
  });

  it('selectShortcut 写入 range 草稿，confirm 提交', () => {
    const onChange = vi.fn();
    const logic = createDatePickerLogic({ type: 'range', onChange });
    logic.toggleOpen();
    logic.selectShortcut(['2026-10-01', '2026-10-07']);
    expect(logic.getState().draft).toEqual(['2026-10-01', '2026-10-07']);
    expect(logic.getState().open).toBe(true);
    logic.confirm();
    expect(logic.getState().value).toEqual(['2026-10-01', '2026-10-07']);
    expect(onChange).toHaveBeenCalledWith(['2026-10-01', '2026-10-07']);
  });

  it("clear 触发 onChange 通知外部清空（range 为 ['', '']）", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const logic = createDatePickerLogic({
      type: 'range',
      defaultValue: ['2026-01-01', '2026-01-31'],
      onChange,
      onClear,
    });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().draft).toBeNull();
    expect(onChange).toHaveBeenCalledWith(['', '']);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
