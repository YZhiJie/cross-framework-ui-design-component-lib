/**
 * Cascader 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createCascaderLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createCascaderLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { CascaderEvents, CascaderLogic, CascaderProps, CascaderSlots } from './types';

export const cascaderSpec = {
  name: 'Cascader',
  props: {
    type: {
      value: Array,
      defaultValue: Array,
      options: Array,
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      separator: String,
      changeOnSelect: Boolean,
      multiple: Boolean,
      checkStrictly: Boolean,
      className: String,
      style: Object,
      onChange: Function,
      onClear: Function,
    },
    defaults: {
      disabled: false,
      clearable: false,
      separator: ' / ',
      changeOnSelect: false,
      multiple: false,
      checkStrictly: false,
    },
  },
  events: {
    change: {
      description: '选中值变更时触发（载荷为值路径与文案路径）',
      payloadType: '(string[], string[])',
    },
    clear: { description: '点击清除图标时触发' },
  },
  slots: {
    clearIcon: { description: '自定义清除图标' },
    suffixIcon: { description: '自定义后缀图标' },
  },
  useLogic: (props: CascaderProps) =>
    createCascaderLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      options: props.options,
      disabled: props.disabled,
      separator: props.separator,
      changeOnSelect: props.changeOnSelect,
      multiple: props.multiple,
      checkStrictly: props.checkStrictly,
      onChange: props.onChange,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<CascaderProps, CascaderEvents, CascaderSlots, CascaderLogic>;
