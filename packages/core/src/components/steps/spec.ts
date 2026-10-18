/**
 * Steps 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createStepsLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createStepsLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { StepsEvents, StepsLogic, StepsProps, StepsSlots } from './types';

export const stepsSpec = {
  name: 'Steps',
  props: {
    type: {
      items: Array,
      value: Number,
      defaultValue: Number,
      status: String,
      direction: String,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      direction: 'horizontal',
    },
  },
  events: {
    change: {
      description: '当前步骤变更时触发（点击非禁用步骤或命令式 API）',
      payloadType: 'number',
    },
  },
  slots: {},
  useLogic: (props: StepsProps) =>
    createStepsLogic({
      items: props.items,
      value: props.value,
      defaultValue: props.defaultValue,
      status: props.status,
      direction: props.direction,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<StepsProps, StepsEvents, StepsSlots, StepsLogic>;
