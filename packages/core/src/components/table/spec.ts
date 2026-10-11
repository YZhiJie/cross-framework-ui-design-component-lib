/**
 * Table 组件规格
 *
 * useLogic 指向 @xui/shared 的 createTableLogic 逻辑工厂，
 * Vue / React 适配层通过同一份规格驱动组件状态。
 * 排序为非受控内部排序（客户端比较），sortChange 回调同步结果。
 * 虚拟滚动由适配层基于 createVirtualListLogic 组合，行选择由逻辑层维护。
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
      virtual: Boolean,
      height: [Number, String],
      rowHeight: Number,
      rowSelection: Object,
      className: String,
      style: Object,
      onSortChange: Function,
      onRowClick: Function,
    },
    defaults: {
      stripe: false,
      border: false,
      virtual: false,
      rowHeight: 40,
    },
  },
  events: {
    sortChange: { description: '排序变更时触发', payloadType: 'TableSort' },
    rowClick: { description: '行点击时触发（选择列单元格不触发）', payloadType: 'TableRow' },
  },
  slots: {
    empty: { description: '空数据内容', fallback: '暂无数据' },
  },
  useLogic: (props: TableProps) =>
    createTableLogic({
      dataSource: props.dataSource,
      rowKey: props.rowKey,
      rowSelection: props.rowSelection,
      onSortChange: props.onSortChange,
    }),
} satisfies ComponentSpec<TableProps, TableEvents, TableSlots, TableLogic>;
