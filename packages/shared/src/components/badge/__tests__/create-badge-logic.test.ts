import { describe, expect, it, vi } from 'vitest';
import { createBadgeLogic } from '../create-badge-logic';

describe('createBadgeLogic', () => {
  it('count 未提供时不显示', () => {
    expect(createBadgeLogic().getState()).toEqual({ visible: false, text: null });
  });

  it('count 正常显示文本', () => {
    expect(createBadgeLogic({ count: 5 }).getState()).toEqual({ visible: true, text: '5' });
  });

  it('count 为 0 默认隐藏，showZero 开启后显示', () => {
    expect(createBadgeLogic({ count: 0 }).getState()).toEqual({ visible: false, text: null });
    expect(createBadgeLogic({ count: 0, showZero: true }).getState()).toEqual({
      visible: true,
      text: '0',
    });
  });

  it('count 超过 max 显示 `${max}+`', () => {
    expect(createBadgeLogic({ count: 120 }).getState().text).toBe('99+');
    expect(createBadgeLogic({ count: 120, max: 10 }).getState().text).toBe('10+');
    expect(createBadgeLogic({ count: 99 }).getState().text).toBe('99');
  });

  it('非法 max 回退默认 99，非法 count 不显示', () => {
    expect(createBadgeLogic({ count: 120, max: -1 }).getState().text).toBe('99+');
    expect(createBadgeLogic({ count: Number.NaN }).getState()).toEqual({
      visible: false,
      text: null,
    });
  });

  it('dot 模式恒显示且无文本，忽略 count / showZero', () => {
    expect(createBadgeLogic({ dot: true }).getState()).toEqual({ visible: true, text: null });
    expect(createBadgeLogic({ dot: true, count: 0 }).getState()).toEqual({
      visible: true,
      text: null,
    });
  });

  it('updateOptions 变更派生结果并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createBadgeLogic({ count: 5 });
    logic.subscribe(listener);

    logic.updateOptions({ count: 0 });
    expect(logic.getState()).toEqual({ visible: false, text: null });
    expect(listener).toHaveBeenCalledTimes(1);

    logic.updateOptions({ count: 0 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
