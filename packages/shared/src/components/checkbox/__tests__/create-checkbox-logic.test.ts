import { describe, expect, it, vi } from 'vitest';
import { createCheckboxLogic } from '../create-checkbox-logic';

describe('createCheckboxLogic', () => {
  it('初始状态：非受控取 defaultValue，受控取 value', () => {
    expect(createCheckboxLogic({}).getState().checked).toBe(false);
    expect(createCheckboxLogic({ defaultValue: true }).getState().checked).toBe(true);
    expect(createCheckboxLogic({ value: true, defaultValue: false }).getState().checked).toBe(true);
  });

  it('toggle 翻转选中态并触发 onChange（非受控）', () => {
    const onChange = vi.fn();
    const logic = createCheckboxLogic({ onChange });
    logic.toggle();
    expect(logic.getState().checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
    logic.toggle();
    expect(logic.getState().checked).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('受控模式：toggle 只触发回调，不改内部状态（由外部同步）', () => {
    const onChange = vi.fn();
    const logic = createCheckboxLogic({ value: false, onChange });
    logic.toggle();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(logic.getState().checked).toBe(false);
    logic.updateOptions({ value: true });
    expect(logic.getState().checked).toBe(true);
  });

  it('indeterminate 状态点击后切换为全选并清除半选（非受控）', () => {
    const onChange = vi.fn();
    const logic = createCheckboxLogic({ indeterminate: true, onChange });
    logic.toggle();
    expect(logic.getState().checked).toBe(true);
    expect(logic.getState().indeterminate).toBe(false);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('受控模式下 indeterminate 由外部通过 updateOptions 管理', () => {
    const logic = createCheckboxLogic({ value: false, indeterminate: true });
    logic.toggle();
    // 内部不自行清除，等外部同步
    expect(logic.getState().indeterminate).toBe(true);
    logic.updateOptions({ indeterminate: false, value: true });
    expect(logic.getState()).toEqual({ checked: true, disabled: false, indeterminate: false });
  });

  it('disabled 时 toggle 被忽略', () => {
    const onChange = vi.fn();
    const logic = createCheckboxLogic({ disabled: true, onChange });
    logic.toggle();
    expect(onChange).not.toHaveBeenCalled();
    expect(logic.getState().checked).toBe(false);
  });

  it('updateOptions 更新回调引用（latest ref）', () => {
    const first = vi.fn();
    const second = vi.fn();
    const logic = createCheckboxLogic({ onChange: first });
    logic.updateOptions({ onChange: second });
    logic.toggle();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(true);
  });

  it('subscribe 返回取消订阅函数，取消后不再通知', () => {
    const listener = vi.fn();
    const logic = createCheckboxLogic({});
    const unsubscribe = logic.subscribe(listener);
    unsubscribe();
    logic.updateOptions({ disabled: true });
    expect(listener).not.toHaveBeenCalled();
  });
});
