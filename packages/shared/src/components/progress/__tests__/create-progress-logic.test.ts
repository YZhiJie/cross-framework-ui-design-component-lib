import { describe, expect, it, vi } from 'vitest';
import { createProgressLogic } from '../create-progress-logic';

describe('createProgressLogic', () => {
  it('默认状态：percent 0 / status normal / strokeWidth 6', () => {
    expect(createProgressLogic().getState()).toEqual({
      percent: 0,
      status: 'normal',
      strokeWidth: 6,
    });
  });

  it('percent 越界收敛到 [0, 100]', () => {
    expect(createProgressLogic({ percent: -10 }).getState().percent).toBe(0);
    expect(createProgressLogic({ percent: 150 }).getState().percent).toBe(100);
  });

  it('percent 非有限数值按 0 处理', () => {
    expect(createProgressLogic({ percent: Number.NaN }).getState().percent).toBe(0);
    expect(createProgressLogic({ percent: undefined }).getState().percent).toBe(0);
  });

  it('percent 达到 100 时派生 success 状态', () => {
    expect(createProgressLogic({ percent: 100 }).getState().status).toBe('success');
    expect(createProgressLogic({ percent: 99.9 }).getState().status).toBe('normal');
  });

  it('显式 status 优先于派生（error 不被 100 覆盖）', () => {
    expect(createProgressLogic({ percent: 100, status: 'error' }).getState().status).toBe('error');
    expect(createProgressLogic({ percent: 30, status: 'error' }).getState().status).toBe('error');
  });

  it('strokeWidth 非法值回退默认 6', () => {
    expect(createProgressLogic({ strokeWidth: 0 }).getState().strokeWidth).toBe(6);
    expect(createProgressLogic({ strokeWidth: -2 }).getState().strokeWidth).toBe(6);
    expect(createProgressLogic({ strokeWidth: Number.NaN }).getState().strokeWidth).toBe(6);
    expect(createProgressLogic({ strokeWidth: 8 }).getState().strokeWidth).toBe(8);
  });

  it('updateOptions 重新派生状态并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createProgressLogic();
    logic.subscribe(listener);

    logic.updateOptions({ percent: 100 });
    expect(logic.getState()).toEqual({ percent: 100, status: 'success', strokeWidth: 6 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
