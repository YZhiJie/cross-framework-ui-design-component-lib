/**
 * Skeleton 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createSkeletonLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * 纯展示组件：无契约事件，loading 切换骨架与真实内容。
 */

import { createSkeletonLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { SkeletonEvents, SkeletonLogic, SkeletonProps, SkeletonSlots } from './types';

export const skeletonSpec = {
  name: 'Skeleton',
  props: {
    type: {
      loading: Boolean,
      avatar: Boolean,
      rows: Number,
      className: String,
      style: Object,
    },
    defaults: {
      loading: true,
      avatar: false,
      rows: 3,
    },
  },
  events: {},
  slots: {
    default: { description: '真实内容（loading=false 时渲染）' },
  },
  useLogic: (props: SkeletonProps) =>
    createSkeletonLogic({
      loading: props.loading,
      avatar: props.avatar,
      rows: props.rows,
    }),
} satisfies ComponentSpec<SkeletonProps, SkeletonEvents, SkeletonSlots, SkeletonLogic>;
