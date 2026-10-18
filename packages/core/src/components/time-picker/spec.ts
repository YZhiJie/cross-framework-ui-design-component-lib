/**
 * TimePicker 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createTimePickerLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createTimePickerLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { TimePickerEvents, TimePickerLogic, TimePickerProps, TimePickerSlots } from './types';

export const timePickerSpec = {
  name: 'TimePicker',
  props: {
    type: {
      value: String,
      defaultValue: String,
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      format: String,
      hourStep: Number,
      minuteStep: Number,
      secondStep: Number,
      className: String,
      style: Object,
      onChange: Function,
      onClear: Function,
    },
    defaults: {
      disabled: false,
      clearable: false,
      format: 'HH:mm:ss',
      hourStep: 1,
      minuteStep: 1,
      secondStep: 1,
    },
  },
  events: {
    change: { description: '选中时间变更时触发', payloadType: 'string' },
    clear: { description: '点击清除图标时触发' },
  },
  slots: {
    clearIcon: { description: '自定义清除图标' },
    clockIcon: { description: '自定义时钟图标' },
  },
  useLogic: (props: TimePickerProps) =>
    createTimePickerLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      format: props.format,
      hourStep: props.hourStep,
      minuteStep: props.minuteStep,
      secondStep: props.secondStep,
      onChange: props.onChange,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<TimePickerProps, TimePickerEvents, TimePickerSlots, TimePickerLogic>;
