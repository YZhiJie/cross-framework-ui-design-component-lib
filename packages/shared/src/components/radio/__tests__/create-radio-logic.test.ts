import { describe, expect, it, vi } from 'vitest';
import { createRadioLogic } from '../create-radio-logic';

describe('createRadioLogic', () => {
  it('初始状态：disabled 默认 false，传入 true 时生效', () => {
    expect(createRadioLogic().getState()).toEqual({ disabled: false });
    expect(createRadioLogic({ disabled: true }).getState()).toEqual({ disabled: true });
  });

  it('updateOptions 同步 disabled 并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createRadioLogic();
    logic.subscribe(listener);

    logic.updateOptions({ disabled: true });
    expect(logic.getState().disabled).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    // 相同值不重复通知
    logic.updateOptions({ disabled: true });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
