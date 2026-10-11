/**
 * Pagination 组件规格
 *
 * useLogic 指向 @xui/shared 的 createPaginationLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 */

import { createPaginationLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { PaginationEvents, PaginationLogic, PaginationProps, PaginationSlots } from './types';

export const paginationSpec = {
  name: 'Pagination',
  props: {
    type: {
      value: Number,
      defaultValue: Number,
      total: Number,
      pageSize: Number,
      disabled: Boolean,
      className: String,
      style: Object,
      onChange: Function,
    },
    defaults: {
      pageSize: 10,
      disabled: false,
    },
  },
  events: {
    change: { description: '页码变更时触发', payloadType: 'number' },
  },
  slots: {
    prevIcon: { description: '自定义上一页图标' },
    nextIcon: { description: '自定义下一页图标' },
  },
  useLogic: (props: PaginationProps) =>
    createPaginationLogic({
      value: props.value,
      defaultValue: props.defaultValue,
      total: props.total,
      pageSize: props.pageSize,
      disabled: props.disabled,
      onChange: props.onChange,
    }),
} satisfies ComponentSpec<PaginationProps, PaginationEvents, PaginationSlots, PaginationLogic>;
