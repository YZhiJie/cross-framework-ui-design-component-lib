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
      value: [String, Array],
      defaultValue: [String, Array],
      options: Array,
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      multiple: Boolean,
      searchable: Boolean,
      virtual: Boolean,
      maxHeight: Number,
      className: String,
      style: Object,
      onChange: Function,
      onClear: Function,
    },
    defaults: {
      disabled: false,
      clearable: false,
      multiple: false,
      searchable: false,
      virtual: false,
      maxHeight: 264,
    },
  },
  events: {
    change: {
      description: '选中值变更时触发（多选载荷为 string[]）',
      payloadType: 'string | string[]',
    },
    clear: { description: '点击清除图标时触发' },
  },
  slots: {
    clearIcon: { description: '自定义清除图标' },
    suffixIcon: { description: '自定义下拉箭头图标' },
  },
  useLogic: (props: SelectProps) =>
    createSelectLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      options: props.options,
      disabled: props.disabled,
      clearable: props.clearable,
      multiple: props.multiple,
      searchable: props.searchable,
      onChange: props.onChange,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<SelectProps, SelectEvents, SelectSlots, SelectLogic>;
