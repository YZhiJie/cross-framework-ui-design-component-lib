import { describe, expect, it, vi } from 'vitest';
import { createAlertLogic } from '../create-alert-logic';

describe('createAlertLogic', () => {
  it('初始状态：默认可见，closable / showIcon 默认关闭', () => {
    expect(createAlertLogic({}).getState()).toEqual({ visible: true, closable: false });
    expect(createAlertLogic({ closable: true }).getState().closable).toBe(true);
  });

  it('handleClose 隐藏提示并触发 onClose', () => {
    const onClose = vi.fn();
    const logic = createAlertLogic({ onClose });
    logic.handleClose();
    expect(logic.getState().visible).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('已隐藏后重复 handleClose 被忽略', () => {
    const onClose = vi.fn();
    const logic = createAlertLogic({ onClose });
    logic.handleClose();
    logic.handleClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closable 变更通过 updateOptions 同步并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createAlertLogic({});
    const unsubscribe = logic.subscribe(listener);
    logic.updateOptions({ closable: true });
    expect(logic.getState().closable).toBe(true);
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('updateOptions 更新回调引用（latest ref）', () => {
    const first = vi.fn();
    const second = vi.fn();
    const logic = createAlertLogic({ onClose: first });
    logic.updateOptions({ onClose: second });
    logic.handleClose();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
