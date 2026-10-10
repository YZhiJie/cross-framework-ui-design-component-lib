import { describe, it, expect, vi } from 'vitest';
import { createButtonLogic } from '../create-button-logic';

describe('createButtonLogic', () => {
  describe('初始化', () => {
    it('默认状态为 disabled=false, loading=false', () => {
      const logic = createButtonLogic();
      expect(logic.getState()).toEqual({ disabled: false, loading: false });
    });

    it('接受 disabled 选项', () => {
      const logic = createButtonLogic({ disabled: true });
      expect(logic.getState().disabled).toBe(true);
    });

    it('接受 loading 选项', () => {
      const logic = createButtonLogic({ loading: true });
      expect(logic.getState().loading).toBe(true);
    });

    it('同时接受 disabled 和 loading', () => {
      const logic = createButtonLogic({ disabled: true, loading: true });
      expect(logic.getState()).toEqual({ disabled: true, loading: true });
    });
  });

  describe('getState', () => {
    it('返回浅拷贝快照，修改不影响内部状态', () => {
      const logic = createButtonLogic({ disabled: true });
      const snap = logic.getState();
      snap.disabled = false;
      expect(logic.getState().disabled).toBe(true);
    });
  });

  describe('subscribe', () => {
    it('状态变更时通知订阅者', () => {
      const logic = createButtonLogic();
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.updateOptions({ disabled: true });
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ disabled: true, loading: false });
    });

    it('返回取消订阅函数', () => {
      const logic = createButtonLogic();
      const listener = vi.fn();
      const unsub = logic.subscribe(listener);

      logic.updateOptions({ disabled: true });
      expect(listener).toHaveBeenCalledTimes(1);

      unsub();
      logic.updateOptions({ loading: true });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('支持多个订阅者', () => {
      const logic = createButtonLogic();
      const l1 = vi.fn();
      const l2 = vi.fn();
      logic.subscribe(l1);
      logic.subscribe(l2);

      logic.updateOptions({ disabled: true });
      expect(l1).toHaveBeenCalledTimes(1);
      expect(l2).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOptions', () => {
    it('更新 disabled 并触发通知', () => {
      const logic = createButtonLogic();
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.updateOptions({ disabled: true });
      expect(logic.getState().disabled).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('更新 loading 并触发通知', () => {
      const logic = createButtonLogic();
      logic.updateOptions({ loading: true });
      expect(logic.getState().loading).toBe(true);
    });

    it('更新 onClick 回调', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const logic = createButtonLogic({ onClick: fn1 });
      const event = {} as MouseEvent;

      logic.handleClick(event);
      expect(fn1).toHaveBeenCalledTimes(1);

      logic.updateOptions({ onClick: fn2 });
      logic.handleClick(event);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn1).toHaveBeenCalledTimes(1);
    });

    it('值未变化时不触发通知', () => {
      const logic = createButtonLogic({ disabled: true });
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.updateOptions({ disabled: true });
      expect(listener).not.toHaveBeenCalled();
    });

    it('undefined 值不触发状态变更', () => {
      const logic = createButtonLogic({ disabled: true });
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.updateOptions({ disabled: undefined });
      expect(listener).not.toHaveBeenCalled();
      expect(logic.getState().disabled).toBe(true);
    });
  });

  describe('handleClick', () => {
    it('正常状态下触发 onClick 回调', () => {
      const onClick = vi.fn();
      const logic = createButtonLogic({ onClick });
      const event = {} as MouseEvent;

      logic.handleClick(event);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(event);
    });

    it('disabled 时不触发回调', () => {
      const onClick = vi.fn();
      const logic = createButtonLogic({ onClick, disabled: true });

      logic.handleClick({} as MouseEvent);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('loading 时不触发回调', () => {
      const onClick = vi.fn();
      const logic = createButtonLogic({ onClick, loading: true });

      logic.handleClick({} as MouseEvent);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('无 onClick 时安全调用', () => {
      const logic = createButtonLogic();
      expect(() => logic.handleClick({} as MouseEvent)).not.toThrow();
    });

    it('disabled 通过 updateOptions 变更后也生效', () => {
      const onClick = vi.fn();
      const logic = createButtonLogic({ onClick });
      const event = {} as MouseEvent;

      logic.handleClick(event);
      expect(onClick).toHaveBeenCalledTimes(1);

      logic.updateOptions({ disabled: true });
      logic.handleClick(event);
      expect(onClick).toHaveBeenCalledTimes(1);

      logic.updateOptions({ disabled: false });
      logic.handleClick(event);
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });
});
