/**
 * Select 组件规格
 *
 * useLogic 指向 @xui/shared 的 createSelectLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createSelectLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { SelectEvents, SelectLogic, SelectProps, SelectSlots } from './types';

export const selectSpec = {
  name: 'Select',
  props: {
    type: {
      value: String,
      defaultValue: String,
      options: Array,
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      onChange: Function,
      onClear: Function,
    },
    defaults: {
      disabled: false,
      clearable: false,
    },
  },
  events: {
    change: { description: '选中值变更时触发', payloadType: 'string' },
    clear: { description: '点击清除图标时触发' },
  },
  slots: {},
  useLogic: (props: SelectProps) =>
    createSelectLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      options: props.options,
      disabled: props.disabled,
      clearable: props.clearable,
      onChange: props.onChange,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<SelectProps, SelectEvents, SelectSlots, SelectLogic>;
