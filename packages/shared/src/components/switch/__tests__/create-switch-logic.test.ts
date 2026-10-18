import { describe, expect, it, vi } from 'vitest';
import { createSwitchLogic } from '../create-switch-logic';

describe('createSwitchLogic', () => {
  it('初始状态：非受控取 defaultValue，受控取 value', () => {
    expect(createSwitchLogic({}).getState().checked).toBe(false);
    expect(createSwitchLogic({ defaultValue: true }).getState().checked).toBe(true);
    expect(createSwitchLogic({ value: true, defaultValue: false }).getState().checked).toBe(true);
  });

  it('toggle 翻转选中态并触发 onChange（非受控）', () => {
    const onChange = vi.fn();
    const logic = createSwitchLogic({ onChange });
    logic.toggle();
    expect(logic.getState().checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
    logic.toggle();
    expect(logic.getState().checked).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('受控模式：toggle 只触发回调，不改内部状态（由外部同步）', () => {
    const onChange = vi.fn();
    const logic = createSwitchLogic({ value: false, onChange });
    logic.toggle();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(logic.getState().checked).toBe(false);
    logic.updateOptions({ value: true });
    expect(logic.getState().checked).toBe(true);
  });

  it('disabled / loading 时 toggle 被忽略', () => {
    const onChange = vi.fn();
    const disabledLogic = createSwitchLogic({ disabled: true, onChange });
    disabledLogic.toggle();
    expect(onChange).not.toHaveBeenCalled();

    const loadingLogic = createSwitchLogic({ loading: true, onChange });
    loadingLogic.toggle();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled / loading 变更通过 updateOptions 同步并通知订阅者', () => {
    const listener = vi.fn();
    const logic = createSwitchLogic({});
    logic.subscribe(listener);
    logic.updateOptions({ disabled: true, loading: true });
    expect(logic.getState()).toEqual({ checked: false, disabled: true, loading: true });
    expect(listener).toHaveBeenCalled();
  });

  it('updateOptions 更新回调引用（latest ref）', () => {
    const first = vi.fn();
    const second = vi.fn();
    const logic = createSwitchLogic({ onChange: first });
    logic.updateOptions({ onChange: second });
    logic.toggle();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(true);
  });

  it('subscribe 返回取消订阅函数，取消后不再通知', () => {
    const listener = vi.fn();
    const logic = createSwitchLogic({});
    const unsubscribe = logic.subscribe(listener);
    unsubscribe();
    logic.updateOptions({ disabled: true });
    expect(listener).not.toHaveBeenCalled();
  });

  describe('beforeChange 钩子', () => {
    it('返回 false 时阻止切换，不触发 onChange', () => {
      const onChange = vi.fn();
      const beforeChange = vi.fn(() => false);
      const logic = createSwitchLogic({ beforeChange, onChange });
      logic.toggle();
      expect(beforeChange).toHaveBeenCalledWith(true);
      expect(logic.getState().checked).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('返回 true 时允许切换', () => {
      const onChange = vi.fn();
      const beforeChange = vi.fn(() => true);
      const logic = createSwitchLogic({ beforeChange, onChange });
      logic.toggle();
      expect(logic.getState().checked).toBe(true);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('返回 Promise<true> 时异步允许切换', async () => {
      const onChange = vi.fn();
      const beforeChange = vi.fn(() => Promise.resolve(true));
      const logic = createSwitchLogic({ beforeChange, onChange });
      const result = logic.toggle();
      // pending 期间 loading 为 true
      expect(logic.getState().loading).toBe(true);
      expect(logic.getState().checked).toBe(false);
      await result;
      expect(logic.getState().checked).toBe(true);
      expect(logic.getState().loading).toBe(false);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('返回 Promise<false> 时异步阻止切换', async () => {
      const onChange = vi.fn();
      const beforeChange = vi.fn(() => Promise.resolve(false));
      const logic = createSwitchLogic({ beforeChange, onChange });
      await logic.toggle();
      expect(logic.getState().checked).toBe(false);
      expect(logic.getState().loading).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('Promise reject 时阻止切换', async () => {
      const onChange = vi.fn();
      const beforeChange = vi.fn(() => Promise.reject(new Error('fail')));
      const logic = createSwitchLogic({ beforeChange, onChange });
      await logic.toggle();
      expect(logic.getState().checked).toBe(false);
      expect(logic.getState().loading).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('异步 pending 期间再次 toggle 被忽略', async () => {
      const beforeChange = vi.fn(
        () => new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 10)),
      );
      const onChange = vi.fn();
      const logic = createSwitchLogic({ beforeChange, onChange });
      logic.toggle();
      logic.toggle(); // 被忽略
      expect(beforeChange).toHaveBeenCalledTimes(1);
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
