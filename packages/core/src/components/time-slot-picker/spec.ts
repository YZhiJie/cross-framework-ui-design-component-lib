/**
 * TimeSlotPicker 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createTimeSlotPickerLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createTimeSlotPickerLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type {
  TimeSlotPickerEvents,
  TimeSlotPickerLogic,
  TimeSlotPickerProps,
  TimeSlotPickerSlots,
} from './types';

export const timeSlotPickerSpec = {
  name: 'TimeSlotPicker',
  props: {
    type: {
      granularity: String,
      value: Array,
      defaultValue: Array,
      referenceDate: String,
      showFooter: Boolean,
      disabled: Boolean,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      granularity: 'week',
      referenceDate: '',
      showFooter: true,
      disabled: false,
    },
  },
  events: {
    change: {
      description: '选中时段变更时触发（点击 / 矩形框选 / 命令式 API）',
      payloadType: 'string[]',
    },
  },
  slots: {},
  useLogic: (props: TimeSlotPickerProps) =>
    createTimeSlotPickerLogic({
      granularity: props.granularity,
      value: props.value,
      defaultValue: props.defaultValue,
      referenceDate: props.referenceDate,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<
  TimeSlotPickerProps,
  TimeSlotPickerEvents,
  TimeSlotPickerSlots,
  TimeSlotPickerLogic
>;
