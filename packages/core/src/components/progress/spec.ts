/**
 * Progress 组件规格
 *
 * useLogic 指向 @xui/shared 的 createProgressLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createProgressLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { ProgressEvents, ProgressLogic, ProgressProps, ProgressSlots } from './types';

export const progressSpec = {
  name: 'Progress',
  props: {
    type: {
      percent: Number,
      type: String,
      strokeWidth: Number,
      showText: Boolean,
      status: String,
      className: String,
      style: Object,
    },
    defaults: {
      percent: 0,
      type: 'line',
      strokeWidth: 6,
      showText: true,
      status: 'normal',
    },
  },
  events: {},
  slots: {},
  useLogic: (props: ProgressProps) =>
    createProgressLogic({
      percent: props.percent,
      strokeWidth: props.strokeWidth,
      status: props.status,
    }),
} satisfies ComponentSpec<ProgressProps, ProgressEvents, ProgressSlots, ProgressLogic>;
