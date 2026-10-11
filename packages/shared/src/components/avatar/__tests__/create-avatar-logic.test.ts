import { describe, expect, it, vi } from 'vitest';
import { createAvatarLogic } from '../create-avatar-logic';

describe('createAvatarLogic', () => {
  it('初始状态：无失败态', () => {
    expect(createAvatarLogic().getState()).toEqual({ failed: false });
    expect(createAvatarLogic({ src: 'a.png' }).getState()).toEqual({ failed: false });
  });

  it('handleError 标记失败态并触发 onError', () => {
    const onError = vi.fn();
    const listener = vi.fn();
    const logic = createAvatarLogic({ src: 'a.png', onError });
    logic.subscribe(listener);

    logic.handleError();
    expect(logic.getState().failed).toBe(true);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('无 src 时 handleError 忽略', () => {
    const onError = vi.fn();
    const logic = createAvatarLogic({ onError });
    logic.handleError();
    expect(logic.getState().failed).toBe(false);
    expect(onError).not.toHaveBeenCalled();
  });

  it('重复 handleError 幂等，回调仅触发一次', () => {
    const onError = vi.fn();
    const logic = createAvatarLogic({ src: 'a.png', onError });
    logic.handleError();
    logic.handleError();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('updateOptions 更换 src 时重置失败态（新图可重试）', () => {
    const logic = createAvatarLogic({ src: 'a.png' });
    logic.handleError();
    expect(logic.getState().failed).toBe(true);

    logic.updateOptions({ src: 'b.png' });
    expect(logic.getState().failed).toBe(false);
  });

  it('updateOptions 相同 src 不重置失败态', () => {
    const logic = createAvatarLogic({ src: 'a.png' });
    logic.handleError();
    logic.updateOptions({ src: 'a.png' });
    expect(logic.getState().failed).toBe(true);
  });
});
