import { describe, expect, it, vi } from 'vitest';
import { createPopconfirmLogic } from '../create-popconfirm-logic';

describe('createPopconfirmLogic', () => {
  it('初始状态正确（关闭 / top / 未禁用）', () => {
    const logic = createPopconfirmLogic();
    expect(logic.getState()).toEqual({ open: false, placement: 'top', disabled: false });
  });

  it('placement 收敛：四方位合法值通过，非法值回退 top', () => {
    expect(createPopconfirmLogic({ placement: 'bottom' }).getState().placement).toBe('bottom');
    expect(createPopconfirmLogic({ placement: 'left' }).getState().placement).toBe('left');
    expect(createPopconfirmLogic({ placement: 'right' }).getState().placement).toBe('right');
    expect(createPopconfirmLogic({ placement: 'diagonal' as never }).getState().placement).toBe(
      'top',
    );
  });

  it('toggle 切换开关', () => {
    const logic = createPopconfirmLogic();
    logic.toggle();
    expect(logic.getState().open).toBe(true);
    logic.toggle();
    expect(logic.getState().open).toBe(false);
  });

  it('toggle disabled 时 no-op', () => {
    const logic = createPopconfirmLogic({ disabled: true });
    logic.toggle();
    expect(logic.getState().open).toBe(false);
  });

  it('confirm 收起并触发 onConfirm', () => {
    const onConfirm = vi.fn();
    const logic = createPopconfirmLogic({ onConfirm });
    logic.toggle();
    logic.confirm();
    expect(logic.getState().open).toBe(false);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancel 收起并触发 onCancel', () => {
    const onCancel = vi.fn();
    const logic = createPopconfirmLogic({ onCancel });
    logic.toggle();
    logic.cancel();
    expect(logic.getState().open).toBe(false);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('未开时 confirm / cancel / close 均不触发回调', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const logic = createPopconfirmLogic({ onConfirm, onCancel });
    logic.confirm();
    logic.cancel();
    logic.close();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('close 收起但不触发任何回调', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const logic = createPopconfirmLogic({ onConfirm, onCancel });
    logic.toggle();
    logic.close();
    expect(logic.getState().open).toBe(false);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('updateOptions 运行时禁用收起已开气泡', () => {
    const logic = createPopconfirmLogic();
    logic.toggle();
    expect(logic.getState().open).toBe(true);
    logic.updateOptions({ disabled: true });
    expect(logic.getState()).toEqual({ open: false, placement: 'top', disabled: true });
  });

  it('updateOptions 变更 placement 并通知', () => {
    const listener = vi.fn();
    const logic = createPopconfirmLogic();
    logic.subscribe(listener);
    logic.updateOptions({ placement: 'right' });
    expect(logic.getState().placement).toBe('right');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('subscribe 通知状态变更，getState 返回快照', () => {
    const listener = vi.fn();
    const logic = createPopconfirmLogic();
    logic.subscribe(listener);
    logic.toggle();
    expect(listener).toHaveBeenCalledTimes(1);
    const snapshot = logic.getState();
    logic.toggle();
    expect(snapshot.open).toBe(true);
  });
});
