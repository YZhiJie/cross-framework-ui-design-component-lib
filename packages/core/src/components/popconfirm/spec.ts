/**
 * Popconfirm 组件规格
 *
 * useLogic 指向 @xui/shared 的 createPopconfirmLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * CSS 包裹定位（复用 Tooltip 模式）；点击外部收起且不触发回调。
 */

import { createPopconfirmLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type {
  PopconfirmEvents,
  PopconfirmLogic,
  PopconfirmProps,
  PopconfirmSlots,
} from './types';

export const popconfirmSpec = {
  name: 'Popconfirm',
  props: {
    type: {
      content: String,
      confirmText: String,
      cancelText: String,
      placement: String,
      disabled: Boolean,
      onConfirm: Function,
      onCancel: Function,
    },
    defaults: {
      confirmText: '确定',
      cancelText: '取消',
      placement: 'top',
      disabled: false,
    },
  },
  events: {
    confirm: { description: '点击确定按钮后触发（气泡收起）' },
    cancel: { description: '点击取消按钮后触发（气泡收起）' },
  },
  slots: {
    default: { description: '触发元素' },
    content: { description: '确认文案内容（覆盖 content prop）' },
  },
  useLogic: (props: PopconfirmProps) =>
    createPopconfirmLogic({
      placement: props.placement,
      disabled: props.disabled,
      onConfirm: props.onConfirm,
      onCancel: props.onCancel,
    }),
} satisfies ComponentSpec<PopconfirmProps, PopconfirmEvents, PopconfirmSlots, PopconfirmLogic>;
