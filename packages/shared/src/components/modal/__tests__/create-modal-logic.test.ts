import { describe, it, expect, vi } from 'vitest';
import { createModalLogic } from '../create-modal-logic';

describe('createModalLogic', () => {
  describe('初始化', () => {
    it('默认状态为 visible=false, closable=true', () => {
      const logic = createModalLogic();
      expect(logic.getState()).toEqual({ visible: false, closable: true });
    });

    it('接受 defaultVisible', () => {
      const logic = createModalLogic({ defaultVisible: true });
      expect(logic.getState().visible).toBe(true);
    });

    it('visible 优先于 defaultVisible', () => {
      const logic = createModalLogic({ visible: false, defaultVisible: true });
      expect(logic.getState().visible).toBe(false);
    });

    it('接受 closable=false', () => {
      const logic = createModalLogic({ closable: false });
      expect(logic.getState().closable).toBe(false);
    });

    it('maskClosable 默认 true', () => {
      const logic = createModalLogic({ defaultVisible: true });
      logic.handleMaskClick();
      expect(logic.getState().visible).toBe(false);
    });

    it('closeOnEsc 默认 true', () => {
      const logic = createModalLogic({ defaultVisible: true });
      logic.handleEsc();
      expect(logic.getState().visible).toBe(false);
    });
  });

  describe('getState', () => {
    it('返回浅拷贝快照', () => {
      const logic = createModalLogic();
      const snap = logic.getState();
      snap.visible = true;
      expect(logic.getState().visible).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('状态变更时通知订阅者', () => {
      const logic = createModalLogic();
      const listener = vi.fn();
      logic.subscribe(listener);

      logic.open();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ visible: true, closable: true });
    });

    it('返回取消订阅函数', () => {
      const logic = createModalLogic();
      const listener = vi.fn();
      const unsub = logic.subscribe(listener);

      logic.open();
      expect(listener).toHaveBeenCalledTimes(1);

      unsub();
      logic.close();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('支持多个订阅者', () => {
      const logic = createModalLogic();
      const l1 = vi.fn();
      const l2 = vi.fn();
      logic.subscribe(l1);
      logic.subscribe(l2);

      logic.open();
      expect(l1).toHaveBeenCalledTimes(1);
      expect(l2).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOptions', () => {
    it('更新 visible', () => {
      const logic = createModalLogic();
      logic.updateOptions({ visible: true });
      expect(logic.getState().visible).toBe(true);
    });

    it('更新 closable', () => {
      const logic = createModalLogic();
      logic.updateOptions({ closable: false });
      expect(logic.getState().closable).toBe(false);
    });

    it('更新 maskClosable', () => {
      const logic = createModalLogic({ defaultVisible: true, maskClosable: false });
      logic.handleMaskClick();
      expect(logic.getState().visible).toBe(true);

      logic.updateOptions({ maskClosable: true });
      logic.handleMaskClick();
      expect(logic.getState().visible).toBe(false);
    });

    it('更新 closeOnEsc', () => {
      const logic = createModalLogic({ defaultVisible: true, closeOnEsc: false });
      logic.handleEsc();
      expect(logic.getState().visible).toBe(true);

      logic.updateOptions({ closeOnEsc: true });
      logic.handleEsc();
      expect(logic.getState().visible).toBe(false);
    });

    it('更新所有回调', () => {
      const logic = createModalLogic();
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const onOk = vi.fn();
      const onCancel = vi.fn();

      logic.updateOptions({ onOpen, onClose, onOk, onCancel });
      logic.open();
      expect(onOpen).toHaveBeenCalledTimes(1);

      logic.handleOk();
      expect(onOk).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);

      logic.open();
      onOpen.mockClear();
      onClose.mockClear();

      logic.handleCancel();
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('值未变化时不触发通知', () => {
      const logic = createModalLogic({ visible: true });
      const listener = vi.fn();
      logic.subscribe(listener);
      logic.updateOptions({ visible: true });
      expect(listener).not.toHaveBeenCalled();
    });

    it('undefined 值不触发状态变更', () => {
      const logic = createModalLogic({ visible: true });
      const listener = vi.fn();
      logic.subscribe(listener);
      logic.updateOptions({ visible: undefined });
      expect(listener).not.toHaveBeenCalled();
      expect(logic.getState().visible).toBe(true);
    });

    it('通过 updateOptions 同步 visible 不触发 onOpen/onClose 回调', () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const logic = createModalLogic({ onOpen, onClose });
      const listener = vi.fn();
      logic.subscribe(listener);

      // updateOptions 只更新状态和通知订阅者，不触发 onOpen/onClose
      logic.updateOptions({ visible: true });
      expect(listener).toHaveBeenCalledTimes(1);
      expect(onOpen).not.toHaveBeenCalled();

      logic.updateOptions({ visible: false });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('open', () => {
    it('设置 visible=true 并触发 onOpen', () => {
      const onOpen = vi.fn();
      const logic = createModalLogic({ onOpen });
      logic.open();
      expect(logic.getState().visible).toBe(true);
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('已 visible 时不触发 onOpen', () => {
      const onOpen = vi.fn();
      const logic = createModalLogic({ defaultVisible: true, onOpen });
      logic.open();
      expect(onOpen).not.toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('设置 visible=false 并触发 onClose', () => {
      const onClose = vi.fn();
      const logic = createModalLogic({ defaultVisible: true, onClose });
      logic.close();
      expect(logic.getState().visible).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('已不可见时不触发 onClose', () => {
      const onClose = vi.fn();
      const logic = createModalLogic({ onClose });
      logic.close();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('handleOk', () => {
    it('触发 onOk 并关闭', () => {
      const onOk = vi.fn();
      const onClose = vi.fn();
      const logic = createModalLogic({ defaultVisible: true, onOk, onClose });
      logic.handleOk();
      expect(onOk).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(logic.getState().visible).toBe(false);
    });

    it('无 onOk 时安全调用', () => {
      const logic = createModalLogic({ defaultVisible: true });
      expect(() => logic.handleOk()).not.toThrow();
      expect(logic.getState().visible).toBe(false);
    });
  });

  describe('handleCancel', () => {
    it('触发 onCancel 并关闭', () => {
      const onCancel = vi.fn();
      const onClose = vi.fn();
      const logic = createModalLogic({ defaultVisible: true, onCancel, onClose });
      logic.handleCancel();
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(logic.getState().visible).toBe(false);
    });

    it('无 onCancel 时安全调用', () => {
      const logic = createModalLogic({ defaultVisible: true });
      expect(() => logic.handleCancel()).not.toThrow();
      expect(logic.getState().visible).toBe(false);
    });
  });

  describe('handleMaskClick', () => {
    it('maskClosable=true 时关闭', () => {
      const logic = createModalLogic({ defaultVisible: true, maskClosable: true });
      logic.handleMaskClick();
      expect(logic.getState().visible).toBe(false);
    });

    it('maskClosable=false 时不关闭', () => {
      const logic = createModalLogic({ defaultVisible: true, maskClosable: false });
      logic.handleMaskClick();
      expect(logic.getState().visible).toBe(true);
    });
  });

  describe('handleEsc', () => {
    it('closeOnEsc=true 时关闭', () => {
      const logic = createModalLogic({ defaultVisible: true, closeOnEsc: true });
      logic.handleEsc();
      expect(logic.getState().visible).toBe(false);
    });

    it('closeOnEsc=false 时不关闭', () => {
      const logic = createModalLogic({ defaultVisible: true, closeOnEsc: false });
      logic.handleEsc();
      expect(logic.getState().visible).toBe(true);
    });
  });
});
