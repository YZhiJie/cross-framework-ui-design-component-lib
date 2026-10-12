/**
 * Spin 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createSpinLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * 纯展示组件：无契约事件，支持独立 / 包裹两种渲染模式。
 */

import { createSpinLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { SpinEvents, SpinLogic, SpinProps, SpinSlots } from './types';

export const spinSpec = {
  name: 'Spin',
  props: {
    type: {
      size: String,
      spinning: Boolean,
      tip: String,
      className: String,
      style: Object,
    },
    defaults: {
      size: 'md',
      spinning: true,
    },
  },
  events: {},
  slots: {
    default: { description: '包裹内容（spinning 时覆盖半透明遮罩）' },
  },
  useLogic: (props: SpinProps) =>
    createSpinLogic({
      size: props.size,
      spinning: props.spinning,
      tip: props.tip,
    }),
} satisfies ComponentSpec<SpinProps, SpinEvents, SpinSlots, SpinLogic>;
