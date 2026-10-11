/**
 * Table 组件规格
 *
 * useLogic 指向 @xui/shared 的 createTableLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * 排序为非受控内部排序（客户端比较），sortChange 回调同步结果。
 */

import { createTableLogic } from '@xui/shared';

import type { ComponentSpec } from '../../spec';
import type { TableEvents, TableLogic, TableProps, TableSlots } from './types';

export const tableSpec = {
  name: 'Table',
  props: {
    type: {
      columns: Array,
      dataSource: Array,
      rowKey: String,
      stripe: Boolean,
      border: Boolean,
      onSortChange: Function,
    },
    defaults: {
      stripe: false,
      border: false,
    },
  },
  events: {
    sortChange: { description: '排序变更时触发', payloadType: 'TableSort' },
  },
  slots: {
    empty: { description: '空数据内容', fallback: '暂无数据' },
  },
  useLogic: (props: TableProps) =>
    createTableLogic({
      dataSource: props.dataSource,
      onSortChange: props.onSortChange,
    }),
} satisfies ComponentSpec<TableProps, TableEvents, TableSlots, TableLogic>;
