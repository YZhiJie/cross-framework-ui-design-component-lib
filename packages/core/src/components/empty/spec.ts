/**
 * Empty 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createEmptyLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createEmptyLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { EmptyEvents, EmptyLogic, EmptyProps, EmptySlots } from './types';

export const emptySpec = {
  name: 'Empty',
  props: {
    type: {
      description: String,
      className: String,
      style: Object,
    },
    defaults: {},
  },
  events: {},
  slots: {
    default: { description: '底部动作区' },
    image: { description: '自定义插画（覆盖默认插画）' },
  },
  useLogic: (props: EmptyProps) =>
    createEmptyLogic({
      description: props.description,
    }),
} satisfies ComponentSpec<EmptyProps, EmptyEvents, EmptySlots, EmptyLogic>;
