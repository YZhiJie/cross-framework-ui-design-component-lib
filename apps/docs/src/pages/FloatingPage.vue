<script setup lang="ts">
/**
 * 浮层视口避让指南页：方位翻转 / 偏移钳制 / 滚动 resize 实时重算
 * 独立于组件文档页，走 /floating 路由
 * 展示文案全部为 LText 双语结构，经 t() 按当前语言取值（模板内调用即响应式）
 */
import DemoBlock from '../components/DemoBlock.vue';
import ApiSection from '../components/ApiSection.vue';
import type { ComponentMeta, DemoDefinition } from '../content/types';
import { isZh, t, type LText } from '../i18n';
import { useUiMessages } from '../i18n/ui-messages';

import FlipVue from '../content/floating/demos/flip.vue';
import FlipReact from '../content/floating/demos/flip';
import MultiVue from '../content/floating/demos/multi.vue';
import MultiReact from '../content/floating/demos/multi';

import flipVueSource from '../content/floating/demos/flip.vue?raw';
import flipReactSource from '../content/floating/demos/flip.tsx?raw';
import multiVueSource from '../content/floating/demos/multi.vue?raw';
import multiReactSource from '../content/floating/demos/multi.tsx?raw';

const ui = useUiMessages();

/** 页面级文案（ui-messages 未覆盖的部分） */
const pageText = {
  summary: {
    'zh-CN':
      'Tooltip / Popconfirm / Select 等浮层组件双端共用 @xui-design/shared/floating 的纯逻辑避让模块：首选方位空间不足时自动翻转（flip），交叉轴溢出视口时自动钳制（shift），滚动与窗口 resize 时经 rAF 合并实时重算。',
    'en-US':
      'Overlay components such as Tooltip / Popconfirm / Select share the framework-agnostic avoidance logic in @xui-design/shared/floating on both frameworks: auto-flip when the preferred placement lacks space (flip), clamping when the cross axis overflows the viewport (shift), and real-time recomputation on scroll and window resize, batched with rAF.',
  },
  mechanismTitle: {
    'zh-CN': '工作机制',
    'en-US': 'How It Works',
  },
  apiIntroA: {
    'zh-CN': '浮层避让 API 由 ',
    'en-US': 'The floating avoidance API lives in ',
  },
  apiIntroB: {
    'zh-CN':
      ' 提供（框架无关纯逻辑），Tooltip / Popconfirm / Select 双端适配层桥接调用，不直接暴露给应用层。',
    'en-US':
      ' (framework-agnostic pure logic), bridged by the Tooltip / Popconfirm / Select adapters on both frameworks — not exposed directly to applications.',
  },
} satisfies Record<string, LText>;

/** 工作机制列表片段：strong 加粗 / code 行内代码 / text 普通文本，按序拼接成句 */
interface Segment {
  strong?: LText;
  code?: string;
  text?: LText;
}

const mechanismItems: Segment[][] = [
  [
    { strong: { 'zh-CN': 'flip 方位翻转', 'en-US': 'Flip Placement' } },
    {
      text: {
        'zh-CN': '：计算首选方位与对侧的可用空间（如 ',
        'en-US': ': measures the available space on the preferred side and its opposite (e.g. ',
      },
    },
    { code: 'spaceAbove = trigger.top - viewport.top' },
    {
      text: {
        'zh-CN': '），首选方位放不下且对侧更充足时翻转；两侧都不足时维持首选方位，避免抖动。',
        'en-US':
          '); flips only when the preferred side does not fit and the opposite side has more room; if neither side fits, the preferred placement is kept to avoid jitter.',
      },
    },
  ],
  [
    { strong: { 'zh-CN': 'shift 偏移钳制', 'en-US': 'Shift Clamping' } },
    {
      text: {
        'zh-CN': '：居中对齐后向视口安全区钳制（默认 ',
        'en-US': ': after centering, the popper is clamped into the viewport safe area (',
      },
    },
    { code: '≥ 8px' },
    {
      text: {
        'zh-CN': '），交叉轴溢出时保持安全区不贴边 / 不裁切。',
        'en-US':
          ' by default), so cross-axis overflow keeps the safe gap instead of touching edges or getting clipped.',
      },
    },
  ],
  [
    {
      strong: {
        'zh-CN': 'scroll / resize 实时重算',
        'en-US': 'Real-Time Recompute on scroll / resize',
      },
    },
    {
      text: {
        'zh-CN': '：滚动事件以 capture 方式监听 ',
        'en-US': ': scroll events are observed on ',
      },
    },
    { code: 'window' },
    {
      text: {
        'zh-CN': '（祖先容器滚动也能收到），回调经 ',
        'en-US':
          ' in the capture phase (so scrolling of any ancestor container is received), and callbacks are batched via ',
      },
    },
    { code: 'requestAnimationFrame' },
    {
      text: {
        'zh-CN': ' 合并，一帧内最多执行一次。',
        'en-US': ' to run at most once per frame.',
      },
    },
  ],
  [
    { strong: { 'zh-CN': '框架无关', 'en-US': 'Framework-Agnostic' } },
    { text: { 'zh-CN': '：', 'en-US': ': ' } },
    { code: 'resolveFloatingPosition' },
    {
      text: {
        'zh-CN':
          ' 是纯函数，不读 DOM / 不写样式；DOM 测量与样式应用由双端适配层桥接，逻辑层不重复实现。',
        'en-US':
          ' is a pure function that never reads the DOM or writes styles; DOM measurement and style application are bridged by the two framework adapters, with no duplicated logic.',
      },
    },
  ],
  [
    { strong: { 'zh-CN': 'SSR 安全降级', 'en-US': 'SSR-Safe Fallback' } },
    {
      text: { 'zh-CN': '：无 ', 'en-US': ': without ' },
    },
    { code: 'window' },
    {
      text: { 'zh-CN': ' 时 ', 'en-US': ', ' },
    },
    { code: 'getViewport' },
    {
      text: { 'zh-CN': ' 返回零矩形、', 'en-US': ' returns a zero rect and ' },
    },
    { code: 'bindViewportUpdate' },
    {
      text: {
        'zh-CN': ' 返回空函数，不抛错。',
        'en-US': ' returns a no-op function — nothing throws.',
      },
    },
  ],
];

const demos: DemoDefinition[] = [
  {
    id: 'flip',
    title: {
      'zh-CN': '方位翻转（flip）',
      'en-US': 'Placement Flipping (flip)',
    },
    description: {
      'zh-CN':
        '首选方位空间不足且对侧更充足时自动翻转：placement="top" 在视口顶部翻转到 bottom，placement="bottom" 在视口底部翻转到 top。',
      'en-US':
        'Flips automatically when the preferred placement lacks space and the opposite side has more: placement="top" flips to bottom at the top of the viewport, and placement="bottom" flips to top at the bottom.',
    },
    vueComponent: FlipVue,
    reactComponent: FlipReact,
    vueSource: flipVueSource,
    reactSource: flipReactSource,
  },
  {
    id: 'multi',
    title: {
      'zh-CN': '三组件共用避让逻辑',
      'en-US': 'Three Components, One Avoidance Logic',
    },
    description: {
      'zh-CN':
        'Tooltip / Popconfirm / Select 双端共用 @xui-design/shared/floating 的翻转与钳制算法，不重复实现。',
      'en-US':
        'Tooltip / Popconfirm / Select share the flip and clamp algorithms from @xui-design/shared/floating on both frameworks — implemented once.',
    },
    vueComponent: MultiVue,
    reactComponent: MultiReact,
    vueSource: multiVueSource,
    reactSource: multiReactSource,
  },
];

const api: ComponentMeta['api'] = {
  methods: [
    {
      name: 'resolveFloatingPosition',
      signature:
        '(trigger: FloatingRect, popper: FloatingRect, viewport: FloatingViewport, options: ResolveFloatingOptions) => FloatingPosition',
      description: {
        'zh-CN':
          '纯函数：输入触发器 / 浮层 / 视口的坐标矩形，输出最终方位（可能已翻转）与交叉轴平移量；不读 DOM、不写样式，便于单测。',
        'en-US':
          'Pure function: takes the trigger / popper / viewport rects and returns the final placement (possibly flipped) plus the cross-axis shift; never reads the DOM or writes styles, making it easy to unit test.',
      },
    },
    {
      name: 'getViewport',
      signature: '() => FloatingViewport',
      description: {
        'zh-CN':
          '获取当前视口边界（整页可视区域）；SSR / 无 window 环境返回零矩形（计算结果等价于不翻转不偏移）。',
        'en-US':
          'Returns the current viewport bounds (the visible page area); returns a zero rect in SSR / window-less environments (equivalent to no flip and no shift).',
      },
    },
    {
      name: 'bindViewportUpdate',
      signature: '(callback: () => void) => () => void',
      description: {
        'zh-CN':
          '订阅视口变化（scroll capture + resize），回调经 rAF 合并（一帧最多一次）；返回解绑函数，组件卸载时调用即可彻底清理。',
        'en-US':
          'Subscribes to viewport changes (scroll capture + resize) with callbacks batched via rAF (at most once per frame); returns an unbind function — call it on component unmount for full cleanup.',
      },
    },
  ],
  types: [
    {
      name: 'FloatingPlacement',
      definition: `type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';`,
      description: {
        'zh-CN': '四方位联合类型，与 core 契约的 placement 对齐。',
        'en-US': 'Union of the four placements, aligned with the placement contract in core.',
      },
    },
    {
      name: 'FloatingRect',
      definition: `type FloatingRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};`,
      description: {
        'zh-CN': '视口坐标矩形，可直接传 getBoundingClientRect() 的结果。',
        'en-US':
          'A viewport-coordinate rect; accepts the result of getBoundingClientRect() directly.',
      },
    },
    {
      name: 'ResolveFloatingOptions',
      definition: `type ResolveFloatingOptions = {
  placement: FloatingPlacement;
  gap?: number;        // 触发器与浮层间距，默认 8
  viewportPadding?: number; // 视口边缘安全区，默认 8
};`,
      description: {
        'zh-CN': 'resolveFloatingPosition 的入参选项。',
        'en-US': 'Options for resolveFloatingPosition.',
      },
    },
    {
      name: 'FloatingPosition',
      definition: `type FloatingPosition = {
  placement: FloatingPlacement; // 实际方位（可能已翻转）
  shift: number;                // 交叉轴平移量（px）
};`,
      description: {
        'zh-CN':
          '避让计算结果：top/bottom 方位 shift 为水平位移（正向右移），left/right 方位为垂直位移（正向下移）。',
        'en-US':
          'The avoidance result: for top/bottom placements, shift is horizontal (positive moves right); for left/right placements, it is vertical (positive moves down).',
      },
    },
  ],
};

const notes: LText[] = [
  {
    'zh-CN':
      'CSS 包裹定位前提：浮层已通过 CSS 包裹方案随文档流跟随触发器，本模块仅输出避让修正；适配层必须先保证基础定位（居中 + gap）正确，再叠加 shift。',
    'en-US':
      'Built on CSS wrapper positioning: the popper already follows its trigger in document flow via the CSS wrapper approach, and this module only outputs avoidance corrections; adapters must get the base positioning (centering + gap) right before applying shift.',
  },
  {
    'zh-CN':
      '翻转避免抖动：只在首选方位空间不足且对侧更充足时才翻转，两侧都不足时维持首选方位（由 shift 钳制兜底），不在边界附近来回翻转。',
    'en-US':
      'Flip without jitter: flips only when the preferred side lacks space and the opposite side has more; when neither side fits, the preferred placement is kept (with shift clamping as the fallback) instead of flipping back and forth near the boundary.',
  },
  {
    'zh-CN':
      'scroll 必须用 capture：滚动事件不冒泡，祖先容器滚动只能在捕获阶段于 window 收到；bindViewportUpdate 已用 capture，适配层不要改回冒泡监听。',
    'en-US':
      'Scroll must use capture: scroll events do not bubble, so scrolling of ancestor containers can only be observed on window in the capture phase; bindViewportUpdate already uses capture — do not switch adapters back to bubble listeners.',
  },
  {
    'zh-CN':
      '组件卸载必须解绑：bindViewportUpdate 返回的解绑函数须在 onBeforeUnmount / useEffect cleanup 中调用，否则监听泄漏、回调引用已卸载 DOM。',
    'en-US':
      'Always unbind on unmount: the unbind function returned by bindViewportUpdate must be called in onBeforeUnmount / useEffect cleanup, otherwise listeners leak and callbacks reference unmounted DOM.',
  },
  {
    'zh-CN':
      'overflow: hidden 祖先仍可能裁剪面板：气泡采用 CSS 包裹定位而非 portal，父容器存在 overflow 裁剪时需在布局层面规避。',
    'en-US':
      'overflow: hidden ancestors can still clip the popper: since bubbles use CSS wrapper positioning rather than a portal, avoid clipping ancestors at the layout level.',
  },
];
</script>

<template>
  <div class="docs-content">
    <header class="page-head">
      <h1 class="page-head__title">
        {{ isZh() ? '浮层视口避让' : 'Floating Positioning' }}
        <span class="page-head__en">{{ isZh() ? 'Floating Positioning' : '浮层视口避让' }}</span>
        <span class="doc-tag">{{ isZh() ? '指南' : 'Guide' }}</span>
      </h1>
      <p class="page-head__summary">
        {{ t(pageText.summary) }}
      </p>
    </header>

    <section>
      <h2 class="docs-section-title">{{ t(pageText.mechanismTitle) }}</h2>
      <ul class="docs-list">
        <li v-for="(item, index) in mechanismItems" :key="index">
          <template v-for="(segment, i) in item" :key="i">
            <strong v-if="segment.strong">{{ t(segment.strong) }}</strong>
            <code v-else-if="segment.code" class="inline-code">{{ segment.code }}</code>
            <template v-else-if="segment.text">{{ t(segment.text) }}</template>
          </template>
        </li>
      </ul>
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.demos }}</h2>
      <p style="margin-bottom: 8px; color: var(--docs-text-secondary); font-size: 13px">
        {{ ui.component.demosHint }}
      </p>
      <DemoBlock v-for="demo in demos" :key="demo.id" :demo="demo" />
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.api }}</h2>
      <p style="margin-bottom: 16px; color: var(--docs-text-secondary); font-size: 13px">
        {{ t(pageText.apiIntroA) }}<code class="inline-code">@xui-design/shared/floating</code
        >{{ t(pageText.apiIntroB) }}
      </p>
      <ApiSection :api="api" />
    </section>

    <section>
      <h2 class="docs-section-title">{{ ui.component.notes }}</h2>
      <ul class="docs-list">
        <li v-for="note in notes" :key="note['zh-CN']">{{ t(note) }}</li>
      </ul>
    </section>
  </div>
</template>
