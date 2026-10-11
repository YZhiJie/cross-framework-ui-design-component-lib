/**
 * Alert 组件规格
 *
 * useLogic 指向 @xui/shared 的 createAlertLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createAlertLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { AlertEvents, AlertLogic, AlertProps, AlertSlots } from './types';

export const alertSpec = {
  name: 'Alert',
  props: {
    type: {
      type: String,
      title: String,
      description: String,
      closable: Boolean,
      showIcon: Boolean,
      className: String,
      style: Object,
      onClose: Function,
    },
    defaults: {
      type: 'info',
      closable: false,
      showIcon: false,
    },
  },
  events: {
    close: { description: '点击关闭按钮时触发（组件随后隐藏）' },
  },
  slots: {
    default: { description: '描述内容（覆盖 description prop）' },
    title: { description: '标题（覆盖 title prop）' },
    icon: { description: '类型图标（覆盖默认图标，showIcon 开启时生效）' },
    closeIcon: { description: '自定义关闭图标' },
  },
  useLogic: (props: AlertProps) =>
    createAlertLogic({
      closable: props.closable,
      onClose: props.onClose,
    }),
} satisfies ComponentSpec<AlertProps, AlertEvents, AlertSlots, AlertLogic>;
