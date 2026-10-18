/**
 * Drawer 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createDrawerLogic 逻辑工厂。
 */

import { createDrawerLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { DrawerEvents, DrawerLogic, DrawerProps, DrawerSlots } from './types';

export const drawerSpec = {
  name: 'Drawer',
  props: {
    type: {
      visible: Boolean,
      defaultVisible: Boolean,
      placement: String,
      size: [Number, String],
      title: String,
      closable: Boolean,
      mask: Boolean,
      maskClosable: Boolean,
      closeOnEsc: Boolean,
      trapFocus: Boolean,
      className: String,
      style: Object,
      onOpen: Function,
      onClose: Function,
    },
    defaults: {
      placement: 'right',
      size: 378,
      closable: true,
      mask: true,
      maskClosable: true,
      closeOnEsc: true,
      trapFocus: true,
    },
  },
  events: {
    open: { description: '抽屉打开后触发' },
    close: { description: '抽屉关闭后触发' },
  },
  slots: {
    default: { description: '抽屉内容' },
    title: { description: '标题区域（覆盖 title prop）' },
    footer: { description: '底部操作区' },
    closeIcon: { description: '自定义关闭图标' },
  },
  useLogic: (props: DrawerProps) =>
    createDrawerLogic({
      visible: props.visible,
      defaultVisible: props.defaultVisible,
      closable: props.closable,
      maskClosable: props.maskClosable,
      closeOnEsc: props.closeOnEsc,
      onOpen: props.onOpen,
      onClose: props.onClose,
    }),
} satisfies ComponentSpec<DrawerProps, DrawerEvents, DrawerSlots, DrawerLogic>;
