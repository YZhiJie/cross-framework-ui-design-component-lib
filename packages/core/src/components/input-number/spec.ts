/**
 * InputNumber 组件规格
 *
 * useLogic 指向 @xui/shared 的 createInputNumberLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * ARIA spinbutton 模式；number | null 契约（空值 / 非法输入均为 null）。
 */

import { createInputNumberLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type {
  InputNumberEvents,
  InputNumberLogic,
  InputNumberProps,
  InputNumberSlots,
} from './types';

export const inputNumberSpec = {
  name: 'InputNumber',
  props: {
    type: {
      value: Number,
      defaultValue: Number,
      min: Number,
      max: Number,
      step: Number,
      precision: Number,
      disabled: Boolean,
      placeholder: String,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      step: 1,
      disabled: false,
    },
  },
  events: {
    change: {
      description: '值提交时触发（清空 / 非法输入载荷为 null）',
      payloadType: 'number | null',
    },
  },
  slots: {
    upIcon: { description: '自定义步进递增图标' },
    downIcon: { description: '自定义步进递减图标' },
  },
  useLogic: (props: InputNumberProps) =>
    createInputNumberLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      min: props.min,
      max: props.max,
      step: props.step,
      precision: props.precision,
      disabled: props.disabled,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<InputNumberProps, InputNumberEvents, InputNumberSlots, InputNumberLogic>;
