/**
 * Badge 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createBadgeLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createBadgeLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { BadgeEvents, BadgeLogic, BadgeProps, BadgeSlots } from './types';

export const badgeSpec = {
  name: 'Badge',
  props: {
    type: {
      count: Number,
      max: Number,
      dot: Boolean,
      showZero: Boolean,
      className: String,
      style: Object,
    },
    defaults: {
      max: 99,
      dot: false,
      showZero: false,
    },
  },
  events: {},
  slots: {
    default: { description: '徽标包裹的内容' },
  },
  useLogic: (props: BadgeProps) =>
    createBadgeLogic({
      count: props.count,
      max: props.max,
      dot: props.dot,
      showZero: props.showZero,
    }),
} satisfies ComponentSpec<BadgeProps, BadgeEvents, BadgeSlots, BadgeLogic>;
