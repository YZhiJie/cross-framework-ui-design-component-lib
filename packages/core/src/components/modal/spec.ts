/**
 * Modal 组件规格
 *
 * useLogic 指向 @xui/shared 的 createModalLogic 逻辑工厂。
 */

import { createModalLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { ModalEvents, ModalLogic, ModalProps, ModalSlots } from './types';

export const modalSpec = {
  name: 'Modal',
  props: {
    type: {
      visible: Boolean,
      defaultVisible: Boolean,
      title: String,
      width: [Number, String],
      closable: Boolean,
      maskClosable: Boolean,
      closeOnEsc: Boolean,
      okText: String,
      cancelText: String,
      trapFocus: Boolean,
      className: String,
      style: Object,
      onOpen: Function,
      onClose: Function,
      onOk: Function,
      onCancel: Function,
    },
    defaults: {
      width: 520,
      closable: true,
      maskClosable: true,
      closeOnEsc: true,
      okText: '确认',
      cancelText: '取消',
      trapFocus: true,
    },
  },
  events: {
    open: { description: '弹窗打开后触发' },
    close: { description: '弹窗关闭后触发' },
    ok: { description: '点击确认按钮时触发（确认后自动关闭）' },
    cancel: { description: '点击取消按钮时触发（取消后自动关闭）' },
  },
  slots: {
    default: { description: '弹窗内容' },
    title: { description: '标题区域（覆盖 title prop）' },
    footer: { description: '底部操作区' },
  },
  useLogic: (props: ModalProps) =>
    createModalLogic({
      visible: props.visible,
      defaultVisible: props.defaultVisible,
      closable: props.closable,
      maskClosable: props.maskClosable,
      closeOnEsc: props.closeOnEsc,
      onOpen: props.onOpen,
      onClose: props.onClose,
      onOk: props.onOk,
      onCancel: props.onCancel,
    }),
} satisfies ComponentSpec<ModalProps, ModalEvents, ModalSlots, ModalLogic>;
