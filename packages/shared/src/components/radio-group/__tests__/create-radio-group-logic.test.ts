import { describe, expect, it, vi } from 'vitest';
import { createRadioGroupLogic } from '../create-radio-group-logic';

describe('createRadioGroupLogic', () => {
  it('初始状态：未选中为 null，defaultValue 生效', () => {
    expect(createRadioGroupLogic().getState()).toEqual({ value: null, disabled: false });
    expect(createRadioGroupLogic({ defaultValue: 'a' }).getState().value).toBe('a');
  });

  it('非受控模式：select 更新选中值并触发回调', () => {
    const onChange = vi.fn();
    const listener = vi.fn();
    const logic = createRadioGroupLogic({ onChange });
    logic.subscribe(listener);

    logic.select('b');
    expect(logic.getState().value).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('受控模式：select 仅触发回调，内部值由外部同步', () => {
    const onChange = vi.fn();
    const logic = createRadioGroupLogic({ value: 'a', onChange });

    logic.select('b');
    expect(logic.getState().value).toBe('a');
    expect(onChange).toHaveBeenCalledWith('b');

    logic.updateOptions({ value: 'b' });
    expect(logic.getState().value).toBe('b');
  });

  it('disabled 时 select 忽略且不触发回调', () => {
    const onChange = vi.fn();
    const logic = createRadioGroupLogic({ disabled: true, onChange });
    logic.select('a');
    expect(logic.getState().value).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('非受控重复 select 相同值：状态不变但回调仍触发', () => {
    const onChange = vi.fn();
    const listener = vi.fn();
    const logic = createRadioGroupLogic({ defaultValue: 'a', onChange });
    logic.subscribe(listener);

    logic.select('a');
    expect(logic.getState().value).toBe('a');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(listener).not.toHaveBeenCalled();
  });

  it('updateOptions 同步 disabled；value 为 undefined 时不覆盖状态', () => {
    const logic = createRadioGroupLogic({ defaultValue: 'a' });
    logic.updateOptions({ value: undefined, disabled: true });
    expect(logic.getState()).toEqual({ value: 'a', disabled: true });
  });
});
