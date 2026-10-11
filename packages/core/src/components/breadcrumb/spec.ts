/**
 * Breadcrumb 组件规格
 *
 * useLogic 指向 @xui/shared 的 createBreadcrumbLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * ARIA 导航模式：nav + ol/li，末项 aria-current="page"。
 */

import { createBreadcrumbLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { BreadcrumbEvents, BreadcrumbLogic, BreadcrumbProps, BreadcrumbSlots } from './types';

export const breadcrumbSpec = {
  name: 'Breadcrumb',
  props: {
    type: {
      items: Array,
      separator: String,
      onItemClick: Function,
    },
    defaults: {
      separator: '/',
    },
  },
  events: {
    itemClick: {
      description: '点击可导航项时触发（末项与 disabled 项不触发）',
      payloadType: 'BreadcrumbItem, number',
    },
  },
  slots: {
    default: { description: '自定义内容区（覆盖 items 渲染）' },
  },
  useLogic: (props: BreadcrumbProps) =>
    createBreadcrumbLogic({
      items: props.items,
      separator: props.separator,
      onItemClick: props.onItemClick,
    }),
} satisfies ComponentSpec<BreadcrumbProps, BreadcrumbEvents, BreadcrumbSlots, BreadcrumbLogic>;
