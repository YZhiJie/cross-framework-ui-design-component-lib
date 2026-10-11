import { describe, expect, it, vi } from 'vitest';
import { createSpinLogic } from '../create-spin-logic';

describe('createSpinLogic', () => {
  it('初始状态正确（md / spinning / 无 tip）', () => {
    const logic = createSpinLogic();
    expect(logic.getState()).toEqual({ size: 'md', spinning: true, tip: null });
  });

  it('size 收敛：三档合法值通过', () => {
    expect(createSpinLogic({ size: 'sm' }).getState().size).toBe('sm');
    expect(createSpinLogic({ size: 'lg' }).getState().size).toBe('lg');
  });

  it('size 收敛：非法值回退 md', () => {
    const logic = createSpinLogic({ size: 'xl' as never });
    expect(logic.getState().size).toBe('md');
  });

  it('spinning 默认 true，显式 false 生效', () => {
    expect(createSpinLogic({}).getState().spinning).toBe(true);
    expect(createSpinLogic({ spinning: false }).getState().spinning).toBe(false);
  });

  it('tip 空串归一为 null，非空通过', () => {
    expect(createSpinLogic({ tip: '' }).getState().tip).toBeNull();
    expect(createSpinLogic({ tip: '加载中' }).getState().tip).toBe('加载中');
  });

  it('updateOptions 可变更全部状态并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createSpinLogic({});
    logic.subscribe(listener);
    logic.updateOptions({ size: 'lg', spinning: false, tip: '处理中' });
    expect(logic.getState()).toEqual({ size: 'lg', spinning: false, tip: '处理中' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('updateOptions 无变化不通知', () => {
    const listener = vi.fn();
    const logic = createSpinLogic({ size: 'md' });
    logic.subscribe(listener);
    logic.updateOptions({ size: 'md' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('updateOptions 非法 size 回退 md', () => {
    const logic = createSpinLogic({ size: 'sm' });
    logic.updateOptions({ size: 'huge' as never });
    expect(logic.getState().size).toBe('md');
  });

  it('getState 返回快照，内部状态修改不影响快照', () => {
    const logic = createSpinLogic({});
    const snapshot = logic.getState();
    logic.updateOptions({ spinning: false });
    expect(snapshot.spinning).toBe(true);
  });
});
