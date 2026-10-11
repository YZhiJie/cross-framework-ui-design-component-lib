import { describe, expect, it, vi } from 'vitest';
import { createTooltipLogic } from '../create-tooltip-logic';

describe('createTooltipLogic', () => {
  it('初始状态：未展开、未禁用', () => {
    const logic = createTooltipLogic();
    expect(logic.getState()).toEqual({ open: false, disabled: false });
  });

  it('show 展开提示框，重复 show 为 no-op', () => {
    const logic = createTooltipLogic();
    logic.show();
    expect(logic.getState().open).toBe(true);
    logic.show();
    expect(logic.getState().open).toBe(true);
  });

  it('hide 收起提示框，未展开时为 no-op', () => {
    const logic = createTooltipLogic();
    logic.hide();
    expect(logic.getState().open).toBe(false);
    logic.show();
    logic.hide();
    expect(logic.getState().open).toBe(false);
  });

  it('disabled 时 show 不展开', () => {
    const logic = createTooltipLogic({ disabled: true });
    logic.show();
    expect(logic.getState().open).toBe(false);
  });

  it('运行时禁用会收起已展开的提示框并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createTooltipLogic();
    logic.subscribe(listener);
    logic.show();
    logic.updateOptions({ disabled: true });
    expect(logic.getState()).toEqual({ open: false, disabled: true });
    expect(listener).toHaveBeenCalled();
    logic.show();
    expect(logic.getState().open).toBe(false);
  });

  it('updateOptions 取消禁用后可重新展开', () => {
    const logic = createTooltipLogic({ disabled: true });
    logic.updateOptions({ disabled: false });
    logic.show();
    expect(logic.getState().open).toBe(true);
  });
});
