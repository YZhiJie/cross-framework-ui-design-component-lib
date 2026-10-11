/**
 * RadioGroup 组件规格
 *
 * useLogic 指向 @xui/shared 的 createRadioGroupLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createRadioGroupLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { RadioGroupEvents, RadioGroupLogic, RadioGroupProps, RadioGroupSlots } from './types';

export const radioGroupSpec = {
  name: 'RadioGroup',
  props: {
    type: {
      value: String,
      defaultValue: String,
      disabled: Boolean,
      options: Array,
      onChange: Function,
    },
    defaults: {
      disabled: false,
    },
  },
  events: {
    change: { description: '选中值变更时触发', payloadType: 'string' },
  },
  slots: {
    default: { description: '自定义选项（渲染 Radio 子项）' },
  },
  useLogic: (props: RadioGroupProps) =>
    createRadioGroupLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<RadioGroupProps, RadioGroupEvents, RadioGroupSlots, RadioGroupLogic>;
