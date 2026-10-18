import { describe, expect, it, vi } from 'vitest';
import {
  createTimePickerLogic,
  formatTime,
  genTimeColumn,
  isValidTimeString,
  parseTimeString,
} from '../create-time-picker-logic';

describe('createTimePickerLogic', () => {
  it('初始状态：非受控未选中时 value 为 null、open 为 false', () => {
    const logic = createTimePickerLogic();
    expect(logic.getState()).toEqual({ value: null, open: false, disabled: false });
  });

  it('非法初始值回退 null', () => {
    const logic = createTimePickerLogic({ defaultValue: '25:00:00' });
    expect(logic.getState().value).toBeNull();
  });

  it('合法默认值初始化 value', () => {
    const logic = createTimePickerLogic({ defaultValue: '09:30:00' });
    expect(logic.getState().value).toBe('09:30:00');
  });

  it('toggleOpen 切换面板，disabled 时忽略', () => {
    const logic = createTimePickerLogic({ disabled: true });
    logic.toggleOpen();
    expect(logic.getState().open).toBe(false);

    const logic2 = createTimePickerLogic();
    logic2.toggleOpen();
    expect(logic2.getState().open).toBe(true);
    logic2.toggleOpen();
    expect(logic2.getState().open).toBe(false);
  });

  it('select 非受控更新 value 并收起面板、触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ onChange });
    logic.toggleOpen();
    logic.select(14, 5, 30);
    const state = logic.getState();
    expect(state.value).toBe('14:05:30');
    expect(state.open).toBe(false);
    expect(onChange).toHaveBeenCalledWith('14:05:30');
  });

  it('select 受控模式不更新内部 value，仅回调', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ value: '00:00:00', onChange });
    logic.select(8, 0, 0);
    expect(logic.getState().value).toBe('00:00:00');
    expect(onChange).toHaveBeenCalledWith('08:00:00');
  });

  it('select 非法值被忽略', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ onChange });
    logic.select(24, 0, 0);
    logic.select(0, 60, 0);
    expect(logic.getState().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clear 非受控清空 value 并触发 onClear', () => {
    const onClear = vi.fn();
    const logic = createTimePickerLogic({ defaultValue: '12:00:00', onClear });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('updateOptions 受控值同步（非法值回退 null）', () => {
    const logic = createTimePickerLogic({ value: '10:00:00' });
    logic.updateOptions({ value: '11:11:11' });
    expect(logic.getState().value).toBe('11:11:11');
    logic.updateOptions({ value: 'invalid' });
    expect(logic.getState().value).toBeNull();
  });

  it('updateOptions 运行时禁用收起面板', () => {
    const logic = createTimePickerLogic();
    logic.toggleOpen();
    logic.updateOptions({ disabled: true });
    expect(logic.getState().open).toBe(false);
  });
});

describe('time helpers', () => {
  it('formatTime 补零', () => {
    expect(formatTime(9, 5, 3)).toBe('09:05:03');
    expect(formatTime(23, 59, 59)).toBe('23:59:59');
  });

  it('isValidTimeString 边界校验', () => {
    expect(isValidTimeString('00:00:00')).toBe(true);
    expect(isValidTimeString('23:59:59')).toBe(true);
    expect(isValidTimeString('24:00:00')).toBe(false);
    expect(isValidTimeString('12:60:00')).toBe(false);
    expect(isValidTimeString('12:00:60')).toBe(false);
    expect(isValidTimeString('12:00')).toBe(false);
    expect(isValidTimeString('')).toBe(false);
  });

  it('parseTimeString 解析与非法回退', () => {
    expect(parseTimeString('09:05:03')).toEqual({ hour: 9, minute: 5, second: 3 });
    expect(parseTimeString('25:00:00')).toBeNull();
  });

  it('genTimeColumn 按步长生成', () => {
    expect(genTimeColumn(24, 1)).toHaveLength(24);
    expect(genTimeColumn(60, 15)).toEqual([0, 15, 30, 45]);
    expect(genTimeColumn(24, 0)).toHaveLength(24); // step<=1 回退 1
  });
});
