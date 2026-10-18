/**
 * TreeSelect 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createTreeSelectLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createTreeSelectLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { TreeSelectEvents, TreeSelectLogic, TreeSelectProps, TreeSelectSlots } from './types';

export const treeSelectSpec = {
  name: 'TreeSelect',
  props: {
    type: {
      value: [String, Array],
      defaultValue: [String, Array],
      treeData: Array,
      multiple: Boolean,
      checkStrictly: Boolean,
      placeholder: String,
      disabled: Boolean,
      clearable: Boolean,
      defaultExpandAll: Boolean,
      className: String,
      style: Object,
      onChange: Function,
      onClear: Function,
    },
    defaults: {
      disabled: false,
      clearable: false,
      multiple: false,
      checkStrictly: false,
      defaultExpandAll: false,
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
  useLogic: (props: TreeSelectProps) =>
    createTreeSelectLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      treeData: props.treeData,
      multiple: props.multiple,
      checkStrictly: props.checkStrictly,
      defaultExpandAll: props.defaultExpandAll,
      disabled: props.disabled,
      onChange: props.onChange,
      onClear: props.onClear,
    }),
} satisfies ComponentSpec<TreeSelectProps, TreeSelectEvents, TreeSelectSlots, TreeSelectLogic>;
