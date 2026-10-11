import { describe, expect, it, vi } from 'vitest';
import { createEmptyLogic } from '../create-empty-logic';

describe('createEmptyLogic', () => {
  it('默认状态：description 为 null（不渲染描述区）', () => {
    expect(createEmptyLogic().getState()).toEqual({ description: null });
  });

  it('description 正常传入', () => {
    expect(createEmptyLogic({ description: '暂无数据' }).getState().description).toBe('暂无数据');
  });

  it('空白字符串归一化为 null', () => {
    expect(createEmptyLogic({ description: '   ' }).getState().description).toBeNull();
    expect(createEmptyLogic({ description: '' }).getState().description).toBeNull();
  });

  it('updateOptions 同步 description 并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createEmptyLogic({ description: 'a' });
    logic.subscribe(listener);

    logic.updateOptions({ description: 'b' });
    expect(logic.getState().description).toBe('b');
    expect(listener).toHaveBeenCalledTimes(1);

    // undefined 不覆盖
    logic.updateOptions({});
    expect(logic.getState().description).toBe('b');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
