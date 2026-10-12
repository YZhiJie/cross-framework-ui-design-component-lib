/**
 * Button 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createButtonLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createButtonLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { ButtonEvents, ButtonLogic, ButtonProps, ButtonSlots } from './types';

export const buttonSpec = {
  name: 'Button',
  props: {
    type: {
      type: String,
      size: String,
      disabled: Boolean,
      loading: Boolean,
      block: Boolean,
      className: String,
      style: Object,
      onClick: Function,
    },
    defaults: {
      type: 'default',
      size: 'md',
      disabled: false,
      loading: false,
      block: false,
    },
  },
  events: {
    click: { description: '点击按钮时触发', payloadType: 'MouseEvent' },
  },
  slots: {
    default: { description: '按钮内容' },
    icon: { description: '前置图标' },
    loadingIcon: { description: '加载态图标，默认渲染 Spinner' },
  },
  useLogic: (props: ButtonProps) =>
    createButtonLogic({
      disabled: props.disabled,
      loading: props.loading,
      onClick: props.onClick,
    }),
} satisfies ComponentSpec<ButtonProps, ButtonEvents, ButtonSlots, ButtonLogic>;
