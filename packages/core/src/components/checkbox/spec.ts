/**
 * Checkbox 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createCheckboxLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createCheckboxLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { CheckboxEvents, CheckboxLogic, CheckboxProps, CheckboxSlots } from './types';

export const checkboxSpec = {
  name: 'Checkbox',
  props: {
    type: {
      value: Boolean,
      defaultValue: Boolean,
      disabled: Boolean,
      indeterminate: Boolean,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      disabled: false,
      indeterminate: false,
    },
  },
  events: {
    change: { description: '选中状态变更时触发', payloadType: 'boolean' },
  },
  slots: {
    default: { description: '标签内容' },
    checkIcon: { description: '自定义选中勾选图标' },
    indeterminateIcon: { description: '自定义半选图标' },
  },
  useLogic: (props: CheckboxProps) =>
    createCheckboxLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      disabled: props.disabled,
      indeterminate: props.indeterminate,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<CheckboxProps, CheckboxEvents, CheckboxSlots, CheckboxLogic>;
