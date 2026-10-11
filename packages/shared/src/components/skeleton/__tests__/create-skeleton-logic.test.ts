import { describe, expect, it, vi } from 'vitest';
import { createSkeletonLogic } from '../create-skeleton-logic';

describe('createSkeletonLogic', () => {
  it('初始状态正确（loading / 无 avatar / 3 行）', () => {
    const logic = createSkeletonLogic();
    expect(logic.getState()).toEqual({ loading: true, avatar: false, rows: 3 });
  });

  it('loading 显式 false 生效', () => {
    expect(createSkeletonLogic({ loading: false }).getState().loading).toBe(false);
  });

  it('avatar 显式 true 生效', () => {
    expect(createSkeletonLogic({ avatar: true }).getState().avatar).toBe(true);
  });

  it('rows 合法值通过，小数向下取整', () => {
    expect(createSkeletonLogic({ rows: 5 }).getState().rows).toBe(5);
    expect(createSkeletonLogic({ rows: 4.7 }).getState().rows).toBe(4);
  });

  it('rows 非法值回退 3', () => {
    expect(createSkeletonLogic({ rows: 0 }).getState().rows).toBe(3);
    expect(createSkeletonLogic({ rows: -2 }).getState().rows).toBe(3);
    expect(createSkeletonLogic({ rows: Number.NaN }).getState().rows).toBe(3);
  });

  it('updateOptions 可变更全部状态并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createSkeletonLogic();
    logic.subscribe(listener);
    logic.updateOptions({ loading: false, avatar: true, rows: 5 });
    expect(logic.getState()).toEqual({ loading: false, avatar: true, rows: 5 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('updateOptions 无变化不通知', () => {
    const listener = vi.fn();
    const logic = createSkeletonLogic({ rows: 3 });
    logic.subscribe(listener);
    logic.updateOptions({ rows: 3 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('getState 返回快照，内部状态修改不影响快照', () => {
    const logic = createSkeletonLogic();
    const snapshot = logic.getState();
    logic.updateOptions({ loading: false });
    expect(snapshot.loading).toBe(true);
  });
});
