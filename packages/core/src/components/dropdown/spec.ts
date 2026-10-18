/**
 * Dropdown 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createDropdownLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * CSS 包裹定位（复用 Popconfirm 模式）；hover / click 双触发方式，
 * 菜单项点击后收起并回调；点击外部 / Esc 仅收起不回调。
 */

import { createDropdownLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { DropdownEvents, DropdownLogic, DropdownProps, DropdownSlots } from './types';

export const dropdownSpec = {
  name: 'Dropdown',
  props: {
    type: {
      menu: Array,
      trigger: String,
      placement: String,
      disabled: Boolean,
      className: String,
      style: Object,
      onSelect: Function,
      onVisibleChange: Function,
    },
    defaults: {
      trigger: 'hover',
      placement: 'bottom',
      disabled: false,
    },
  },
  events: {
    select: { description: '点击菜单项后触发（菜单收起）', payloadType: 'DropdownOption' },
    visibleChange: { description: '菜单展开 / 收起时触发', payloadType: 'boolean' },
  },
  slots: {
    default: { description: '触发元素' },
  },
  useLogic: (props: DropdownProps) =>
    createDropdownLogic({
      menu: props.menu,
      trigger: props.trigger,
      placement: props.placement,
      disabled: props.disabled,
      onSelect: props.onSelect,
      onVisibleChange: props.onVisibleChange,
    }),
} satisfies ComponentSpec<DropdownProps, DropdownEvents, DropdownSlots, DropdownLogic>;
