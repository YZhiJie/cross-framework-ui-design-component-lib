/**
 * Waterfall 组件规格
 *
 * useLogic 指向 @xui-design/shared 的 createWaterfallLogic 逻辑工厂，
 * 负责最短列贪心分配、高度缓存与列数变化重排。
 *
 * 响应式断点匹配由适配层完成（ResizeObserver 监听容器宽度），
 * 算出新列数后通过 setColumnCount() 触发逻辑层重排。
 * 条目实际高度由适配层 DOM 测量后通过 updateItemHeight() 回传。
 */

import { createWaterfallLogic } from '@xui-design/shared';

import type { ComponentSpec } from '../../spec';
import type { WaterfallEvents, WaterfallLogic, WaterfallProps, WaterfallSlots } from './types';

export const waterfallSpec = {
  name: 'Waterfall',
  props: {
    type: {
      items: Array,
      rowKey: String,
      columns: Number,
      direction: String,
      rows: Number,
      breakpoints: Array,
      gutter: Number,
      height: [Number, String],
      virtual: Boolean,
      loadMoreThreshold: Number,
      loading: Boolean,
      finished: Boolean,
      className: String,
      style: Object,
      renderItem: Function,
      onItemClick: Function,
      onLayoutChange: Function,
      onLoadMore: Function,
    },
    defaults: {
      columns: 4,
      direction: 'vertical',
      gutter: 16,
      loadMoreThreshold: 200,
    },
  },
  events: {
    itemClick: { description: '条目点击时触发', payloadType: 'WaterfallItem, number' },
    layoutChange: {
      description: '布局变更时触发（列数切换或 DOM 测量后重排）',
      payloadType: 'WaterfallLayoutPayload',
    },
    loadMore: {
      description: '无限滚动：接近底部时触发（需配合 height 使用）',
      payloadType: '() => void',
    },
  },
  slots: {
    empty: { description: '空数据内容' },
    item: { description: '条目自定义渲染（作用域参数 item + index）' },
  },
  useLogic: (props: WaterfallProps) =>
    createWaterfallLogic({
      items: props.items,
      rowKey: props.rowKey,
      columns: props.columns,
      direction: props.direction,
      rows: props.rows,
      gutter: props.gutter,
      onItemClick: props.onItemClick,
      onLayoutChange: props.onLayoutChange,
    }),
} satisfies ComponentSpec<WaterfallProps, WaterfallEvents, WaterfallSlots, WaterfallLogic>;
