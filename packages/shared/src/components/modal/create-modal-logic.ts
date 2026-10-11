/**
 * Modal 纯逻辑工厂
 *
 * 状态：visible / closable
 * 交互：open / close / handleOk / handleCancel / handleMaskClick / handleEsc
 *
 * 回调触发约定：
 * - onOpen / onClose 仅在用户主动操作（open / close / handleOk / handleCancel /
 *   handleMaskClick / handleEsc）时触发；
 * - 外部通过 updateOptions 同步 visible 只更新状态、不触发回调，
 *   由适配层负责将回调映射为 v-model / 受控 props 更新。
 */

import type { LogicInstance, StateListener } from '../../types';

/** Modal 逻辑配置（由适配层从 Props 中提取注入） */
export type ModalLogicOptions = {
  /** 受控可见性（变更时通过 updateOptions 同步） */
  visible?: boolean;
  /** 非受控初始可见性 */
  defaultVisible?: boolean;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnEsc?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
};

/** Modal 状态快照 */
export type ModalState = {
  visible: boolean;
  closable: boolean;
};

/** Modal 逻辑实例 */
export interface ModalLogicInstance extends LogicInstance<ModalLogicOptions, ModalState> {
  open: () => void;
  close: () => void;
  /** 确认：触发 onOk 后关闭 */
  handleOk: () => void;
  /** 取消：触发 onCancel 后关闭 */
  handleCancel: () => void;
  /** 遮罩点击：maskClosable 开启时关闭 */
  handleMaskClick: () => void;
  /** ESC 按键：closeOnEsc 开启时关闭 */
  handleEsc: () => void;
}

export function createModalLogic(options: ModalLogicOptions = {}): ModalLogicInstance {
  const state: ModalState = {
    visible: options.visible ?? options.defaultVisible ?? false,
    closable: options.closable ?? true,
  };

  let maskClosable = options.maskClosable ?? true;
  let closeOnEsc = options.closeOnEsc ?? true;
  let onOpen = options.onOpen;
  let onClose = options.onClose;
  let onOk = options.onOk;
  let onCancel = options.onCancel;

  const listeners = new Set<StateListener<ModalState>>();

  const notify = () => {
    const snapshot = { ...state };
    listeners.forEach((listener) => listener(snapshot));
  };

  /** 用户主动触发的可见性变更：更新状态、通知并触发回调 */
  const setVisible = (next: boolean) => {
    if (state.visible === next) return;
    state.visible = next;
    notify();
    if (next) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState: () => ({ ...state }),

    updateOptions(next) {
      let changed = false;

      if (next.visible !== undefined && next.visible !== state.visible) {
        state.visible = next.visible;
        changed = true;
      }
      if (next.closable !== undefined && next.closable !== state.closable) {
        state.closable = next.closable;
        changed = true;
      }
      if (next.maskClosable !== undefined) maskClosable = next.maskClosable;
      if (next.closeOnEsc !== undefined) closeOnEsc = next.closeOnEsc;
      if (next.onOpen !== undefined) onOpen = next.onOpen;
      if (next.onClose !== undefined) onClose = next.onClose;
      if (next.onOk !== undefined) onOk = next.onOk;
      if (next.onCancel !== undefined) onCancel = next.onCancel;

      if (changed) notify();
    },

    open: () => setVisible(true),

    close: () => setVisible(false),

    handleOk() {
      onOk?.();
      setVisible(false);
    },

    handleCancel() {
      onCancel?.();
      setVisible(false);
    },

    handleMaskClick() {
      if (maskClosable) setVisible(false);
    },

    handleEsc() {
      if (closeOnEsc) setVisible(false);
    },
  };
}
