import { describe, expect, it, vi } from 'vitest';
import { createSwitchLogic } from '../create-switch-logic';

describe('createSwitchLogic', () => {
  it('初始状态：非受控取 defaultValue，受控取 value', () => {
    expect(createSwitchLogic({}).getState().checked).toBe(false);
    expect(createSwitchLogic({ defaultValue: true }).getState().checked).toBe(true);
    expect(createSwitchLogic({ value: true, defaultValue: false }).getState().checked).toBe(true);
  });

  it('toggle 翻转选中态并触发 onChange（非受控）', () => {
    const onChange = vi.fn();
    const logic = createSwitchLogic({ onChange });
    logic.toggle();
    expect(logic.getState().checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
    logic.toggle();
    expect(logic.getState().checked).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('受控模式：toggle 只触发回调，不改内部状态（由外部同步）', () => {
    const onChange = vi.fn();
    const logic = createSwitchLogic({ value: false, onChange });
    logic.toggle();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(logic.getState().checked).toBe(false);
    logic.updateOptions({ value: true });
    expect(logic.getState().checked).toBe(true);
  });

  it('disabled / loading 时 toggle 被忽略', () => {
    const onChange = vi.fn();
    const disabledLogic = createSwitchLogic({ disabled: true, onChange });
    disabledLogic.toggle();
    expect(onChange).not.toHaveBeenCalled();

    const loadingLogic = createSwitchLogic({ loading: true, onChange });
    loadingLogic.toggle();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled / loading 变更通过 updateOptions 同步并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createSwitchLogic({});
    logic.subscribe(listener);
    logic.updateOptions({ disabled: true, loading: true });
    expect(logic.getState()).toEqual({ checked: false, disabled: true, loading: true });
    expect(listener).toHaveBeenCalled();
  });

  it('updateOptions 更新回调引用（latest ref）', () => {
    const first = vi.fn();
    const second = vi.fn();
    const logic = createSwitchLogic({ onChange: first });
    logic.updateOptions({ onChange: second });
    logic.toggle();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(true);
  });

  it('subscribe 返回取消订阅函数，取消后不再通知', () => {
    const listener = vi.fn();
    const logic = createSwitchLogic({});
    const unsubscribe = logic.subscribe(listener);
    unsubscribe();
    logic.updateOptions({ disabled: true });
    expect(listener).not.toHaveBeenCalled();
  });
});
