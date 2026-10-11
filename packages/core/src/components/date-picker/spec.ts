/**
 * DatePicker 组件规格
 *
 * useLogic 指向 @xui/shared 的 createDatePickerLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * ARIA combobox 模式：trigger role="combobox"，面板 role="dialog"。
 */

import { createDatePickerLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { DatePickerEvents, DatePickerLogic, DatePickerProps, DatePickerSlots } from './types';

export const datePickerSpec = {
  name: 'DatePicker',
  props: {
    type: {
      value: String,
      defaultValue: String,
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      className: String,
      style: Object,
      onChange: Function,
      onClear: Function,
    },
    defaults: {
      disabled: false,
      clearable: false,
    },
  },
  events: {
    change: { description: '选中日期变更时触发', payloadType: 'string' },
    clear: { description: '点击清除图标时触发' },
  },
  slots: {},
  useLogic: (props: DatePickerProps) =>
    createDatePickerLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      onChange: props.onChange,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<DatePickerProps, DatePickerEvents, DatePickerSlots, DatePickerLogic>;
