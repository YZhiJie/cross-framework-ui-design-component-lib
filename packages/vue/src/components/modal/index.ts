export type { ModalProps } from '@xui-design/core';

export { default as Modal } from './Modal.vue';

/** 通过 ref 暴露的命令式 API（与 React 适配层的 ModalRef 对齐） */
export interface ModalRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}
