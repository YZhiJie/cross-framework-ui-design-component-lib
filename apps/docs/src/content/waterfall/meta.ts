import type { ComponentMeta } from '../types';
import BasicVue from './demos/basic.vue';
import BasicTsx from './demos/basic';
import ResponsiveVue from './demos/responsive.vue';
import ResponsiveTsx from './demos/responsive';
import ServerLoadVue from './demos/server-load.vue';
import ServerLoadTsx from './demos/server-load';
import ResponsiveServerVue from './demos/responsive-server.vue';
import ResponsiveServerTsx from './demos/responsive-server';
import RandomSizeVue from './demos/random-size.vue';
import RandomSizeTsx from './demos/random-size';

import basicVueSource from './demos/basic.vue?raw';
import basicTsxSource from './demos/basic.tsx?raw';
import responsiveVueSource from './demos/responsive.vue?raw';
import responsiveTsxSource from './demos/responsive.tsx?raw';
import serverLoadVueSource from './demos/server-load.vue?raw';
import serverLoadTsxSource from './demos/server-load.tsx?raw';
import responsiveServerVueSource from './demos/responsive-server.vue?raw';
import responsiveServerTsxSource from './demos/responsive-server.tsx?raw';
import randomSizeVueSource from './demos/random-size.vue?raw';
import randomSizeTsxSource from './demos/random-size.tsx?raw';

/** Waterfall 瀑布流文档元数据 */
export const waterfallMeta: ComponentMeta = {
  name: 'Waterfall',
  slug: 'waterfall',
  title: '瀑布流',
  category: 'display',
  summary: {
    'zh-CN':
      '基于最短列贪心分配的多列瀑布流布局：支持响应式断点自适应列数、图片/内容加载后自动触发重排、高度缓存避免重复测量，列数切换时零成本复用已测量高度。',
    'en-US':
      'Multi-column waterfall layout with shortest-column greedy assignment: responsive breakpoints auto-switch columns, auto-reflow after image/content load, height cache avoids re-measurement and reuses cached heights when column count changes.',
  },
  features: [
    {
      'zh-CN': '最短列贪心分配 + 并列 round-robin，初始未测量场景均匀分布',
      'en-US':
        'Shortest-column greedy assignment with round-robin tie-break for even initial distribution',
    },
    {
      'zh-CN': '响应式断点（breakpoints）自动跟随容器尺寸变化切换列数',
      'en-US': 'Responsive breakpoints auto-switch column count as the container resizes',
    },
    {
      'zh-CN': '高度缓存跨列数切换复用：切换 4→2 列时不重新测量 DOM',
      'en-US':
        'Height cache persists across column-count changes; no re-measurement when switching 4→2 columns',
    },
    {
      'zh-CN': '图片 / 内容异步加载完成后 ResizeObserver 自动触发重排',
      'en-US':
        'ResizeObserver triggers reflow automatically when images or async content finish loading',
    },
    {
      'zh-CN': 'rAF 合并调度：一帧内多次变化只执行一次重排，避免抖动',
      'en-US': 'rAF scheduling: multiple changes in one frame coalesce into a single layout pass',
    },
    {
      'zh-CN': 'CSS 变量 gutter 可覆盖间距（--xui-waterfall-gutter）',
      'en-US': 'CSS variable gutter override (--xui-waterfall-gutter)',
    },
  ],
  scenarios: [
    {
      'zh-CN': '图片画廊 / 商品卡片列表（高度不一的混合内容）',
      'en-US': 'Image galleries and product card lists with mixed heights',
    },
    {
      'zh-CN': '搜索结果页：按最短列自动对齐，视觉紧凑',
      'en-US': 'Search result pages: auto-aligns by shortest column for visual tightness',
    },
    {
      'zh-CN': '自适应仪表盘：窗口缩放 → 自动调整列数',
      'en-US': 'Responsive dashboards: resizing the window auto-adjusts columns',
    },
  ],
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic Usage' },
      description: {
        'zh-CN':
          '固定 3 列、间距 16px，传入不等高数据演示最短列贪心分配；点击触发 itemClick 事件。',
        'en-US':
          'Fixed 3 columns with 16px gutter; uneven-height data demonstrates shortest-column greedy assignment; itemClick fires on click.',
      },
      vueComponent: BasicVue,
      reactComponent: BasicTsx,
      vueSource: basicVueSource,
      reactSource: basicTsxSource,
    },
    {
      id: 'responsive',
      title: { 'zh-CN': '响应式断点', 'en-US': 'Responsive Breakpoints' },
      description: {
        'zh-CN':
          '配置 breakpoints 后，容器宽度变化时自动切换列数（<600px 1 列 / 600-1000px 2 列 / >1000px 3 列），高度缓存复用零成本。',
        'en-US':
          'With breakpoints configured, column count auto-switchs on container resize (<600px 1 col / 600-1000px 2 cols / >1000px 3 cols) with zero-cost height cache reuse.',
      },
      vueComponent: ResponsiveVue,
      reactComponent: ResponsiveTsx,
      vueSource: responsiveVueSource,
      reactSource: responsiveTsxSource,
    },
    {
      id: 'server-load',
      title: { 'zh-CN': '服务端加载 + 无限滚动', 'en-US': 'Server Loading + Infinite Scroll' },
      description: {
        'zh-CN':
          '模拟分页接口（setTimeout + picsum.photos 随机图），滚动触底触发 onLoadMore 拉取下一页；图片 onLoad 后 ResizeObserver 自动重排；配合 loading / finished 守卫避免重复触发。',
        'en-US':
          'Simulated paginated API (setTimeout + picsum.photos images); scroll-to-bottom triggers onLoadMore to fetch the next page; ResizeObserver auto-reflows after each image loads; loading/finished guards prevent duplicate fetches.',
      },
      vueComponent: ServerLoadVue,
      reactComponent: ServerLoadTsx,
      vueSource: serverLoadVueSource,
      reactSource: serverLoadTsxSource,
    },
    {
      id: 'responsive-server',
      title: {
        'zh-CN': '响应式断点 + 服务端不同尺寸图片',
        'en-US': 'Responsive Breakpoints + Mixed-Size Server Images',
      },
      description: {
        'zh-CN':
          '模拟服务端返回宽高各异的图片（320/400/480/560 宽，高度随机），结合 breakpoints 随容器宽度在 2 / 3 / 4 列间切换；图片加载前按真实宽高占位，加载完成后自动重排。',
        'en-US':
          'Simulated API returns images with varying width/height (320/400/480/560 wide, random heights); breakpoints switch between 2/3/4 columns as the container resizes; exact-space placeholders avoid layout shift before images load.',
      },
      vueComponent: ResponsiveServerVue,
      reactComponent: ResponsiveServerTsx,
      vueSource: responsiveServerVueSource,
      reactSource: responsiveServerTsxSource,
    },
    {
      id: 'random-size',
      title: { 'zh-CN': '随机尺寸图片', 'en-US': 'Random-Size Images' },
      description: {
        'zh-CN':
          '每张图片的宽高都在 200~800px 之间随机生成，高度差异明显；点击「换一批」重新生成一组数据，瀑布流按最短列自动重新排布。',
        'en-US':
          'Each image gets a random width/height between 200 and 800px for strongly uneven heights; clicking "Refresh" regenerates the dataset and the waterfall re-packs by shortest column.',
      },
      vueComponent: RandomSizeVue,
      reactComponent: RandomSizeTsx,
      vueSource: randomSizeVueSource,
      reactSource: randomSizeTsxSource,
    },
  ],
  api: {
    props: [
      {
        name: 'items',
        type: 'WaterfallItem[]',
        default: '—',
        required: true,
        description: {
          'zh-CN': '数据源数组（每项为 Record）',
          'en-US': 'Data source array (each item is a Record)',
        },
      },
      {
        name: 'rowKey',
        type: 'string',
        default: '—',
        description: {
          'zh-CN': '唯一键字段名（缺省用下标字符串化）',
          'en-US': 'Unique key field (defaults to stringified index)',
        },
      },
      {
        name: 'columns',
        type: 'number',
        default: '4',
        description: {
          'zh-CN': '固定列数（breakpoints 未提供时生效）',
          'en-US': 'Fixed column count (used when breakpoints is not provided)',
        },
      },
      {
        name: 'direction',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: {
          'zh-CN': '布局方向：vertical 多列纵向瀑布；horizontal 多行横向瀑布（容器横向滚动）',
          'en-US':
            'Layout direction: vertical multi-column masonry; horizontal multi-row masonry with horizontal scrolling',
        },
      },
      {
        name: 'rows',
        type: 'number',
        default: '—（回退到 columns）',
        description: {
          'zh-CN': '横向瀑布流的行数（direction="horizontal" 时生效）',
          'en-US': 'Row count for horizontal layout (only when direction="horizontal")',
        },
      },
      {
        name: 'breakpoints',
        type: 'WaterfallBreakpoint[]',
        default: '—',
        description: {
          'zh-CN': '响应式断点（按 minWidth 升序匹配，覆盖 columns；仅纵向模式生效）',
          'en-US':
            'Responsive breakpoints (match by ascending minWidth; overrides columns; vertical only)',
        },
      },
      {
        name: 'gutter',
        type: 'number',
        default: '16',
        description: {
          'zh-CN': '列间距（px，透传为 --xui-waterfall-gutter CSS 变量）',
          'en-US': 'Column gutter (px, exposed as --xui-waterfall-gutter CSS variable)',
        },
      },
      {
        name: 'className',
        type: 'string',
        default: '—',
        description: { 'zh-CN': '根节点自定义类名', 'en-US': 'Extra class on the root element' },
      },
      {
        name: 'style',
        type: 'Record<string, string>',
        default: '—',
        description: { 'zh-CN': '根节点内联样式', 'en-US': 'Inline style on the root element' },
      },
      {
        name: 'renderItem',
        type: '(item, index) => ReactNode',
        default: '—',
        description: {
          'zh-CN': 'React 端自定义条目渲染回调（Vue 用 #item 作用域插槽）',
          'en-US': 'React item render callback (Vue uses the #item scoped slot)',
        },
      },
      {
        name: 'onItemClick',
        type: '(item, index) => void',
        default: '—',
        description: { 'zh-CN': '条目点击回调', 'en-US': 'Item click callback' },
      },
      {
        name: 'onLayoutChange',
        type: '(payload) => void',
        default: '—',
        description: {
          'zh-CN': '布局变更回调（列数切换 / 重排均触发）',
          'en-US': 'Layout change callback (column switch / reflow)',
        },
      },
    ],
    events: [
      {
        vue: 'itemClick',
        react: 'onItemClick',
        payload: '(item, index)',
        description: { 'zh-CN': '条目点击时触发', 'en-US': 'Fires when an item is clicked' },
      },
      {
        vue: 'layoutChange',
        react: 'onLayoutChange',
        payload: 'WaterfallLayoutPayload',
        description: {
          'zh-CN': '布局变更时触发（列数切换或 DOM 测量后重排）',
          'en-US': 'Fires when layout changes (column count switch or post-measure reflow)',
        },
      },
    ],
    slots: [
      {
        vue: 'empty',
        react: '—',
        description: { 'zh-CN': '空数据内容', 'en-US': 'Content rendered when items is empty' },
      },
      {
        vue: 'item',
        react: 'renderItem',
        description: {
          'zh-CN': '条目自定义渲染（作用域参数 item + index / React 回调）',
          'en-US': 'Custom item render (scoped params item + index on Vue, callback on React)',
        },
      },
    ],
    methods: [],
    types: [
      {
        name: 'WaterfallItem',
        definition: 'type WaterfallItem = Record<string, unknown>;',
        description: { 'zh-CN': '瀑布流条目类型', 'en-US': 'Waterfall item shape' },
      },
      {
        name: 'WaterfallBreakpoint',
        definition: `type WaterfallBreakpoint = {
  minWidth: number;  // 视口最小宽度（px）
  columns: number;   // 该宽度下的列数
};`,
        description: { 'zh-CN': '响应式断点', 'en-US': 'Responsive breakpoint' },
      },
      {
        name: 'WaterfallLayoutPayload',
        definition: `type WaterfallLayoutPayload = {
  columnCount: number;   // 当前列数
  columnHeights: number[];  // 每列累计高度（px）
};`,
        description: { 'zh-CN': '布局变更载荷', 'en-US': 'Layout change payload' },
      },
    ],
  },
  notes: [
    {
      'zh-CN': '高度缓存（Map<key, number>）在逻辑层维护，列数变化时直接复用，零 DOM 测量开销。',
      'en-US':
        'Height cache (Map<key, number>) lives in the logic layer, reused directly on column change — zero DOM re-measurement.',
    },
    {
      'zh-CN':
        'ResizeObserver 全局监听 item 高度变化，图片 onLoad 后自动触发 updateItemHeight → 重排。',
      'en-US':
        'A global ResizeObserver watches item heights; image onLoad auto-triggers updateItemHeight → reflow.',
    },
    {
      'zh-CN': 'jsdom / 旧环境无 ResizeObserver 时降级为首次同步测量，核心布局逻辑不受影响。',
      'en-US':
        'In jsdom or old environments without ResizeObserver, degrades to a one-shot synchronous measure; core layout logic is unaffected.',
    },
    {
      'zh-CN':
        'renderItem 未提供时渲染 xui-waterfall__item-placeholder 占位，业务方应通过 renderItem / #item slot 填充实际内容。',
      'en-US':
        'Without renderItem/#item, xui-waterfall__item-placeholder is rendered; consumers should always provide real content.',
    },
  ],
  a11y: [
    {
      'zh-CN':
        '根节点为语义化容器，条目点击时使用原生 div onClick；若需按钮可访问性建议在 slot 内容里自行封装 button 元素。',
      'en-US':
        'Root is a semantic container; item clicks use native div onClick. For button-level accessibility, wrap your slot content in a button.',
    },
  ],
};
