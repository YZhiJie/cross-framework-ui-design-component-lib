import { describe, expect, it, vi } from 'vitest';
import {
  createTimePickerLogic,
  formatTime,
  genTimeColumn,
  isValidTimeString,
  parseTimeString,
} from '../create-time-picker-logic';

describe('createTimePickerLogic', () => {
  it('初始状态：非受控未选中时 value/draft 为 null、open 为 false', () => {
    const logic = createTimePickerLogic();
    expect(logic.getState()).toEqual({ value: null, draft: null, open: false, disabled: false });
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

  it('selectDraft 仅更新草稿：不收起面板、不触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ onChange });
    logic.toggleOpen();
    logic.selectDraft(14, 5, 30);
    const state = logic.getState();
    expect(state.draft).toBe('14:05:30');
    expect(state.value).toBeNull();
    expect(state.open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('confirm 非受控提交草稿并收起面板、触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ onChange });
    logic.toggleOpen();
    logic.selectDraft(14, 5, 30);
    logic.confirm();
    const state = logic.getState();
    expect(state.value).toBe('14:05:30');
    expect(state.open).toBe(false);
    expect(onChange).toHaveBeenCalledWith('14:05:30');
  });

  it('confirm 受控模式不更新内部 value，仅回调', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ value: '00:00:00', onChange });
    logic.toggleOpen();
    logic.selectDraft(8, 0, 0);
    logic.confirm();
    expect(logic.getState().value).toBe('00:00:00');
    expect(onChange).toHaveBeenCalledWith('08:00:00');
  });

  it('confirm 草稿与当前值相同时不触发 onChange', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ defaultValue: '09:30:00', onChange });
    logic.toggleOpen();
    logic.confirm();
    expect(logic.getState().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('confirm 草稿为空时仅收起面板', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ onChange });
    logic.toggleOpen();
    logic.confirm();
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().open).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('close 丢弃未确认的草稿', () => {
    const onChange = vi.fn();
    const logic = createTimePickerLogic({ defaultValue: '09:30:00', onChange });
    logic.toggleOpen();
    logic.selectDraft(14, 5, 30);
    expect(logic.getState().draft).toBe('14:05:30');
    logic.close();
    const state = logic.getState();
    expect(state.open).toBe(false);
    expect(state.draft).toBe('09:30:00');
    expect(state.value).toBe('09:30:00');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggleOpen 重新展开时草稿从 value 重新拷贝', () => {
    const logic = createTimePickerLogic({ defaultValue: '09:30:00' });
    logic.toggleOpen();
    logic.selectDraft(14, 5, 30);
    logic.close();
    logic.toggleOpen();
    expect(logic.getState().draft).toBe('09:30:00');
  });

  it('selectDraft 非法值被忽略', () => {
    const logic = createTimePickerLogic();
    logic.toggleOpen();
    logic.selectDraft(24, 0, 0);
    logic.selectDraft(0, 60, 0);
    expect(logic.getState().draft).toBeNull();
  });

  it('clear 非受控清空 value 并触发 onClear', () => {
    const onClear = vi.fn();
    const logic = createTimePickerLogic({ defaultValue: '12:00:00', onClear });
    logic.clear();
    expect(logic.getState().value).toBeNull();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('updateOptions 受控值同步（非法值回退 null），草稿跟随', () => {
    const logic = createTimePickerLogic({ value: '10:00:00' });
    logic.updateOptions({ value: '11:11:11' });
    expect(logic.getState().value).toBe('11:11:11');
    expect(logic.getState().draft).toBe('11:11:11');
    logic.updateOptions({ value: 'invalid' });
    expect(logic.getState().value).toBeNull();
    expect(logic.getState().draft).toBeNull();
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
