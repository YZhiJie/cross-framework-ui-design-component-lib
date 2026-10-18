import { describe, expect, it, vi } from 'vitest';
import { createDrawerLogic } from '../create-drawer-logic';

describe('createDrawerLogic', () => {
  it('初始状态默认不可见，closable 默认 true', () => {
    const logic = createDrawerLogic();
    expect(logic.getState()).toEqual({ visible: false, closable: true });
  });

  it('defaultVisible 控制非受控初始可见性', () => {
    const logic = createDrawerLogic({ defaultVisible: true });
    expect(logic.getState().visible).toBe(true);
  });

  it('受控 visible 优先于 defaultVisible', () => {
    const logic = createDrawerLogic({ visible: false, defaultVisible: true });
    expect(logic.getState().visible).toBe(false);
  });

  it('open / close 更新状态并触发 onOpen / onClose', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const logic = createDrawerLogic({ onOpen, onClose });

    logic.open();
    expect(logic.getState().visible).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    logic.close();
    expect(logic.getState().visible).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('重复 open / close 同值时不重复触发回调', () => {
    const onOpen = vi.fn();
    const logic = createDrawerLogic({ defaultVisible: true, onOpen });
    logic.open();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('toggle 在可见与不可见间切换', () => {
    const logic = createDrawerLogic();
    logic.toggle();
    expect(logic.getState().visible).toBe(true);
    logic.toggle();
    expect(logic.getState().visible).toBe(false);
  });

  it('subscribe 接收状态变更通知，退订后不再接收', () => {
    const listener = vi.fn();
    const logic = createDrawerLogic();
    const unsubscribe = logic.subscribe(listener);

    logic.open();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenLastCalledWith({ visible: true, closable: true });

    unsubscribe();
    logic.close();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('handleMaskClick 在 maskClosable 开启时关闭', () => {
    const onClose = vi.fn();
    const logic = createDrawerLogic({ defaultVisible: true, onClose });
    logic.handleMaskClick();
    expect(logic.getState().visible).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('handleMaskClick 在 maskClosable 关闭时不关闭', () => {
    const logic = createDrawerLogic({ defaultVisible: true, maskClosable: false });
    logic.handleMaskClick();
    expect(logic.getState().visible).toBe(true);
  });

  it('handleEsc 在 closeOnEsc 开启时关闭', () => {
    const logic = createDrawerLogic({ defaultVisible: true });
    logic.handleEsc();
    expect(logic.getState().visible).toBe(false);
  });

  it('handleEsc 在 closeOnEsc 关闭时不关闭', () => {
    const logic = createDrawerLogic({ defaultVisible: true, closeOnEsc: false });
    logic.handleEsc();
    expect(logic.getState().visible).toBe(true);
  });

  it('updateOptions 同步 visible 只更新状态、不触发回调（受控同步）', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const logic = createDrawerLogic({ visible: false, onOpen, onClose });

    logic.updateOptions({ visible: true });
    expect(logic.getState().visible).toBe(true);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    logic.updateOptions({ visible: false });
    expect(logic.getState().visible).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('updateOptions 可切换 closable / maskClosable / closeOnEsc', () => {
    const logic = createDrawerLogic({ defaultVisible: true });

    logic.updateOptions({ closable: false });
    expect(logic.getState().closable).toBe(false);

    logic.updateOptions({ maskClosable: false });
    logic.handleMaskClick();
    expect(logic.getState().visible).toBe(true);

    logic.updateOptions({ closeOnEsc: false });
    logic.handleEsc();
    expect(logic.getState().visible).toBe(true);
  });

  it('updateOptions 无变化时不通知订阅者', () => {
    const listener = vi.fn();
    const logic = createDrawerLogic({ visible: false });
    logic.subscribe(listener);

    logic.updateOptions({ visible: false, maskClosable: true });
    expect(listener).not.toHaveBeenCalled();
  });
});
