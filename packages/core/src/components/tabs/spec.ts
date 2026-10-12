/**
 * Tabs 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createTabsLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createTabsLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { TabsEvents, TabsLogic, TabsProps, TabsSlots } from './types';

export const tabsSpec = {
  name: 'Tabs',
  props: {
    type: {
      value: String,
      defaultValue: String,
      items: Array,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {},
  },
  events: {
    change: { description: '激活项变更时触发', payloadType: 'string' },
  },
  slots: {
    default: { description: '面板内容（作用域：当前激活项）' },
  },
  useLogic: (props: TabsProps) =>
    createTabsLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      items: props.items,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<TabsProps, TabsEvents, TabsSlots, TabsLogic>;
