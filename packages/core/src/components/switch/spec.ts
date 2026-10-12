/**
 * Switch 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createSwitchLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createSwitchLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { SwitchEvents, SwitchLogic, SwitchProps, SwitchSlots } from './types';

export const switchSpec = {
  name: 'Switch',
  props: {
    type: {
      value: Boolean,
      defaultValue: Boolean,
      size: String,
      disabled: Boolean,
      loading: Boolean,
      checkedText: String,
      uncheckedText: String,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      size: 'md',
      disabled: false,
      loading: false,
    },
  },
  events: {
    change: { description: '选中状态变更时触发', payloadType: 'boolean' },
  },
  slots: { loadingIcon: { description: '自定义加载图标' } },
  useLogic: (props: SwitchProps) =>
    createSwitchLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      loading: props.loading,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<SwitchProps, SwitchEvents, SwitchSlots, SwitchLogic>;
